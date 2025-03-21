import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import db from '@/src/db';
import order from '@/src/db/schema/order';
import { z } from 'zod';

// Schema for order creation
const orderCreateSchema = z.object({
  wordCount: z.number().min(250),
  pages: z.number().min(1).optional(),
  subject: z.enum(['arts', 'business', 'cs', 'em']),
  typeCategory: z.enum(['coursework', 'bookreport', 'researchpaper', 'thesis', 'proposal']),
  academicLevel: z.enum(['undergraduate', 'masters', 'phd']),
  deadline: z.string().datetime(),
  description: z.string().min(10),
  fileUrls: z.array(z.string()).optional(),
  price: z.number().min(0),
  totalPrice: z.number().min(0),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = orderCreateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: validationResult.error.format() 
      }, { status: 400 });
    }
    
    const validData = validationResult.data;
    
    // Calculate pages if not provided
    const pages = validData.pages || Math.ceil(validData.wordCount / 250);
    
    // Create order in database
    const newOrder = await db.insert(order).values({
      user_id: session.user.id,
      word_count: validData.wordCount,
      pages: pages,
      subject: validData.subject,
      type: validData.typeCategory,
      academic_level: validData.academicLevel,
      deadline: new Date(validData.deadline),
      description: validData.description,
      file_urls: validData.fileUrls || [],
      price: validData.price,
      total_price: validData.totalPrice,
      status: 'pending',
    }).returning();
    
    if (!newOrder.length) {
      throw new Error('Failed to create order');
    }
    
    return NextResponse.json({ 
      message: 'Order created successfully',
      orderId: newOrder[0].id
    }, { status: 201 });
    
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ 
      error: 'Error creating order', 
      details: error instanceof Error ? error.message : 'Unknown error'  
    }, { status: 500 });
  }
} 