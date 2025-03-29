import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const submitWorkSchema = z.object({
  orderId: z.string().uuid(),
  completedFileUrls: z.array(z.string().url()),
  comments: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validate the request body
    const validationResult = submitWorkSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { orderId, completedFileUrls, comments } = validationResult.data;
    
    // Check if order exists and is assigned to the freelancer
    const existingOrder = await db.query.orders.findFirst({
      where: (order, { eq, and }) => {
        const conditions = [eq(order.id, orderId)];
        
        // If the user is not an admin, check if they are the assigned freelancer
        if (session.user?.role !== 'admin' && session.user?.id) {
          conditions.push(eq(order.freelancerId, session.user.id));
        }
        
        return and(...conditions);
      }
    });
    
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found or not assigned to you' }, { status: 404 });
    }
    
    // Update the order with completed work
    const updatedOrder = await db.update(orders)
      .set({ 
        orderStatus: 'completed',
        updatedAt: new Date().toISOString(),
        // Store the completed file URLs as a comma-separated string
        completedFileUrls: completedFileUrls.join(','),
        comments: comments || null
      })
      .where(eq(orders.id, orderId))
      .returning();
    
    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error submitting completed work:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 