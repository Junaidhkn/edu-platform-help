import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import transport from '@/lib/nodemailer';

// Validation schema for the request body
const statusUpdateSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'completed']),
  message: z.string().min(5),
  email: z.string().email(),
  name: z.string().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.id;
    
    // Validate the order exists
    const orderExists = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });
    
    if (!orderExists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = statusUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const { status, message, email, name } = validationResult.data;
    
    // Update order status
    await db
      .update(orders)
      .set({ 
        orderStatus: status,
        updatedAt: new Date().toISOString()
      })
      .where(eq(orders.id, orderId));
    
    // Send email notification
    await sendOrderStatusEmail({
      status,
      email,
      name: name || 'Customer',
      message,
      orderId,
    });
    
    return NextResponse.json({
      message: 'Order status updated successfully',
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({
      error: 'Failed to update order status',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

interface EmailParams {
  status: string;
  email: string;
  name: string;
  message: string;
  orderId: string;
}

async function sendOrderStatusEmail({
  status,
  email,
  name,
  message,
  orderId,
}: EmailParams) {
  const statusTitle = {
    pending: 'Order Status Update: Pending',
    accepted: 'Good News! Your Order Has Been Accepted',
    rejected: 'Order Status Update: Rejected',
    completed: 'Your Order Has Been Completed',
  }[status] || 'Order Status Update';
  
  const statusColor = {
    pending: '#f59e0b',
    accepted: '#10b981',
    rejected: '#ef4444',
    completed: '#3b82f6',
  }[status] || '#64748b';
  
  await transport.sendMail({
    from: `"Edu-assign-help Team" <${process.env.BREVO_SMTP_USER}>`,
    to: email,
    subject: statusTitle,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="text-align: center; color: #3b82f6;">Edu-assign-help</h2>
      <h3>Order Status: <span style="color: ${statusColor}; text-transform: capitalize;">${status}</span></h3>
      <p>Hi ${name},</p>
      <p>This is an update regarding your order #${orderId.slice(-6)}.</p>

      <div style="white-space: pre-line; margin-top: 20px; margin-bottom: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
        ${message.replace(/\n/g, '<br />')}
      </div>
      
      <p>If you have any questions, please contact our support team.</p>
      
      <p>Thank you for choosing our service.</p>
      <p>Best regards,<br />Support Team</p>

      <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 30px;">
        &copy; ${new Date().getFullYear()} Edu-assign-help. All rights reserved.
      </p>
    </div>
    `,
  });
  
  console.log(`Order status email sent to ${email} for order ${orderId}`);
} 