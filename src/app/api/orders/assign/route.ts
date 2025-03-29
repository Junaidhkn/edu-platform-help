import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { orders } from '@/src/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

const assignOrderSchema = z.object({
  orderId: z.string().uuid(),
  freelancerId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Validate the request body
    const validationResult = assignOrderSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { orderId, freelancerId } = validationResult.data;
    
    // Check if order exists and is accepted
    const existingOrder = await db.query.orders.findFirst({
      where: (order, { eq, and }) => and(
        eq(order.id, orderId),
        eq(order.orderStatus, 'accepted')
      )
    });
    
    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found or not in accepted status' }, { status: 404 });
    }
    
    // Check if freelancer exists
    const existingFreelancer = await db.query.freelancers.findFirst({
      where: (freelancer, { eq }) => eq(freelancer.id, freelancerId)
    });
    
    if (!existingFreelancer) {
      return NextResponse.json({ error: 'Freelancer not found' }, { status: 404 });
    }
    
    // Update the order with the freelancer ID
    const updatedOrder = await db.update(orders)
      .set({ 
        freelancerId: freelancerId,
        updatedAt: new Date().toISOString()
      })
      .where(eq(orders.id, orderId))
      .returning();
    
    return NextResponse.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error assigning order to freelancer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 