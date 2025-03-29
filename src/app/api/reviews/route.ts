import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import { review, orders, freelancers } from '@/src/db/schema';
import { reviewFormSchema } from '@/lib/validators/review-schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId');
    const freelancerId = searchParams.get('freelancerId');
    
    if (orderId) {
      // Fetch reviews for a specific order
      const orderReviews = await db.query.review.findMany({
        where: (rev, { eq }) => eq(rev.orderId, orderId),
        with: {
          user: true,
          freelancer: true
        }
      });
      
      return NextResponse.json(orderReviews);
    } else if (freelancerId) {
      // Fetch all reviews for a specific freelancer
      const freelancerReviews = await db.query.review.findMany({
        where: (rev, { eq }) => eq(rev.freelanceId, freelancerId),
        with: {
          user: true,
          order: true
        },
        orderBy: (rev, { desc }) => [desc(rev.createdAt)]
      });
      
      return NextResponse.json(freelancerReviews);
    } else {
      // If no specific parameters, return user's own reviews
      const userReviews = await db.query.review.findMany({
        where: (rev, { eq }) => eq(rev.userId, userId),
        with: {
          freelancer: true,
          order: true
        },
        orderBy: (rev, { desc }) => [desc(rev.createdAt)]
      });
      
      return NextResponse.json(userReviews);
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const body = await request.json();
    
    // Validate request body
    const validationResult = reviewFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { orderId, freelancerId, rating, reviewText } = validationResult.data;
    
    // Verify the order belongs to the user and is completed
    const order = await db.query.orders.findFirst({
      where: (order, { eq, and }) => and(
        eq(order.id, orderId),
        eq(order.userId, userId),
        eq(order.orderStatus, 'completed')
      )
    });
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or not eligible for review' },
        { status: 404 }
      );
    }
    
    // Check if the freelancer is assigned to this order
    if (order.freelancerId !== freelancerId) {
      return NextResponse.json(
        { error: 'Freelancer is not assigned to this order' },
        { status: 400 }
      );
    }
    
    // Check if review already exists for this order
    const existingReview = await db.query.review.findFirst({
      where: (rev, { eq }) => eq(rev.orderId, orderId)
    });
    
    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already exists for this order' },
        { status: 400 }
      );
    }
    
    // Create the review
    const newReview = await db.insert(review).values({
      userId: userId,
      orderId,
      freelanceId: freelancerId,
      rating: rating.toString(),
      reviewText
    }).returning();
    
    // Update freelancer's average rating
    const allFreelancerReviews = await db.query.review.findMany({
      where: (rev, { eq }) => eq(rev.freelanceId, freelancerId)
    });
    
    if (allFreelancerReviews.length > 0) {
      const totalRating = allFreelancerReviews.reduce((sum, rev) => {
        return sum + Number(rev.rating);
      }, 0);
      
      const averageRating = totalRating / allFreelancerReviews.length;
      
      await db.update(freelancers)
        .set({ rating: averageRating.toFixed(1) })
        .where(eq(freelancers.id, freelancerId));
    }
    
    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 