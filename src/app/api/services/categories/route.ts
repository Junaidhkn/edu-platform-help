import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
import { subjectCategories } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Validation schema for the request body
const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3),
  priceModifier: z.number().min(0.1).max(5),
});

// Get all subject categories
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categories = await db.select().from(subjectCategories).orderBy(subjectCategories.name);
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching subject categories:', error);
    return NextResponse.json({
      error: 'Failed to fetch subject categories',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Create a new subject category
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
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
    
    const { id, name, priceModifier } = validationResult.data;
    
    // Check if the category ID already exists
    const existingCategory = await db
      .select({ id: subjectCategories.id })
      .from(subjectCategories)
      .where(eq(subjectCategories.id, id))
      .limit(1);
    
    if (existingCategory.length > 0) {
      return NextResponse.json({
        error: 'Subject category with this ID already exists',
      }, { status: 409 });
    }
    
    // Create the new category
    const newCategory = await db
      .insert(subjectCategories)
      .values({
        id,
        name,
        priceModifier: priceModifier.toString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return NextResponse.json({
      message: 'Subject category created successfully',
      category: newCategory[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating subject category:', error);
    return NextResponse.json({
      error: 'Failed to create subject category',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 