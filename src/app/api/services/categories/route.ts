import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
// Note: You'll need to create or import the subjectCategories schema
// This is a placeholder as the actual schema hasn't been implemented yet

// Validation schema for the request body
const categorySchema = z.object({
  name: z.string().min(3),
  priceModifier: z.number().min(0.1).max(5),
});

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = categorySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const { name, priceModifier } = validationResult.data;
    
    // Here you would add the new category to your database
    // This is a placeholder implementation since we don't have the actual schema yet
    /*
    const newCategory = await db
      .insert(subjectCategories)
      .values({
        id: crypto.randomUUID(),
        name,
        priceModifier,
        createdAt: new Date().toISOString(),
      })
      .returning();
    */
    
    // For now, return a mock response
    return NextResponse.json({
      message: 'Subject category created successfully',
      category: {
        id: 'mock-id',
        name,
        priceModifier,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject category:', error);
    return NextResponse.json({
      error: 'Failed to create subject category',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 