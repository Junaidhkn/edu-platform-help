import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { submissions } from '@/src/db/schema';
import { orders } from '@/src/db/schema';
import { users } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import transport from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is a freelancer
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit work' },
        { status: 401 }
      );
    }
    
    const freelancerId = session.user.id;
    
    // Parse request body
    const body = await request.json();
    const { orderId, fileUrls, comment } = body;
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    if (!fileUrls || !Array.isArray(fileUrls) || fileUrls.length === 0) {
      return NextResponse.json(
        { error: 'At least one file URL is required' },
        { status: 400 }
      );
    }
    
    // Verify that the order exists and is assigned to this freelancer
    const orderData = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    
    if (!orderData) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    if (orderData.freelancerId !== freelancerId) {
      return NextResponse.json(
        { error: 'You are not assigned to this order' },
        { status: 403 }
      );
    }
    
    if (orderData.orderStatus === 'completed') {
      return NextResponse.json(
        { error: 'This order has already been completed' },
        { status: 400 }
      );
    }
    
    // Create the submission - ensure fileUrls is consistently stored as JSON string
    const newSubmission = await db.insert(submissions).values({
      orderId,
      freelancerId,
      fileUrls: JSON.stringify(fileUrls),
      comment: comment || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }).returning();
    
    // Update order status to submitted if it was in progress
    if (orderData.orderStatus === 'in_progress') {
      await db.update(orders)
        .set({ 
          orderStatus: 'submitted',
        })
        .where(eq(orders.id, orderId));
    }
    
    // Get user information for email notification
    const userData = await db.query.users.findFirst({
      where: eq(users.id, orderData.userId),
      columns: {
        email: true,
        name: true,
      },
    });
    
    // Notify admin about new submission
    try {
      await transport.sendMail({
        to: process.env.ADMIN_EMAIL || 'junaidhkn@gmail.com',
        subject: `New Submission for Order #${orderId.slice(-6)}`,
        text: `A freelancer has submitted work for order #${orderId.slice(-6)}. Please review it on the admin dashboard.`,
        html: `
          <h2>New Work Submission</h2>
          <p>A freelancer has submitted work for order #${orderId.slice(-6)}.</p>
          <p>Please review it on the <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/submissions">admin dashboard</a>.</p>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the request if email fails
    }
    
    return NextResponse.json({
      message: 'Submission created successfully',
      submission: newSubmission[0],
    });
    
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
} 