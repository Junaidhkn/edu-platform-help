import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '@/src/lib/stripe-server';
import { auth } from '@/auth';
import db from '@/src/db';
import order from '@/src/db/schema/order';
import { eq } from 'drizzle-orm';
import { neon } from '@neondatabase/serverless';
import env from '@/src/env';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get orderId from query parameters (form submission) or request body (JSON)
    let requestOrderId: string | null = null;
    
    // Check if this is a form submission
    const contentType = req.headers.get('content-type');
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      // This is a form submission
      requestOrderId = req.nextUrl.searchParams.get('orderId');
    } else {
      // This is a JSON submission
      const body = await req.json();
      requestOrderId = body.orderId;
    }
    
    if (!requestOrderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    // Fetch the order
    const orderResult = await db.select()
      .from(order)
      .where(eq(order.id, requestOrderId))
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
      success_url: `${req.headers.get('origin') || process.env.NEXTAUTH_URL}/profile/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || process.env.NEXTAUTH_URL}/profile/orders/cancel?order_id=${orderData.id}`,
      metadata: {
        orderId: orderData.id,
        userId: session.user.id
      }
    } as Stripe.Checkout.SessionCreateParams);
    
    // Make sure we have a session ID before proceeding
    if (!checkoutSession.id) {
      throw new Error("Failed to create Stripe checkout session");
    }
    
    // Use raw SQL for direct database access
    const sql = neon(env.DATABASE_URL);
    
    // Insert the transaction using a raw SQL query
    await sql`
      INSERT INTO "transaction" (order_id, user_id, amount, status, stripe_session_id) 
      VALUES (${orderData.id}, ${session.user.id}, ${amount}, 'pending', ${checkoutSession.id})
    `;
    
    // For form submission, redirect directly to Stripe
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      return NextResponse.redirect(checkoutSession.url || '/profile/orders');
    }
    
    // For JSON submissions, return the session data
    return NextResponse.json({ 
      sessionId: checkoutSession.id, 
      url: checkoutSession.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 