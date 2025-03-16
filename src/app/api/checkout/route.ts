import { NextRequest, NextResponse } from 'next/server';
import stripe from '@/src/lib/stripe-server';
import { auth } from '@/auth';
import db from '@/src/db';
import transaction from '@/src/db/schema/transactions';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await req.json();
    
    // Fetch the order
    const orderResult = await db.select()
      .from(order)
      .where(eq(order.id, orderId))
      .limit(1);
      
    if (!orderResult.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    const orderData = orderResult[0];
    
    // Calculate the amount in cents (Stripe uses the smallest currency unit)
    const amount = Math.round(parseFloat(orderData.total_price.toString()) * 100);
    
    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${orderData.id}`,
              description: orderData.description || 'Academic service',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/profile/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/profile/orders/cancel?order_id=${orderData.id}`,
      metadata: {
        orderId: orderData.id,
        userId: session.user.id
      }
    });
    
    // Record the transaction
    await db.insert(transaction).values({
      orderId: orderData.id,
      userId: session.user.id,
      amount,
      status: 'pending',
      stripeSessionId: checkoutSession.id
    });
    
    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 