import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
import { subjectCategories } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Validation schema for the update request body
const updateCategorySchema = z.object({
  name: z.string().min(3).optional(),
  priceModifier: z.number().min(0.1).max(5).optional(),
});

// Get a specific subject category
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await db
      .select()
      .from(subjectCategories)
      .where(eq(subjectCategories.id, params.id))
      .limit(1)
      .then((results) => results[0] || null);
    
    if (!category) {
      return NextResponse.json({ error: 'Subject category not found' }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching subject category:', error);
    return NextResponse.json({
      error: 'Failed to fetch subject category',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Update a subject category
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = updateCategorySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const updates = validationResult.data;
    
    // Check if the category exists
    const existingCategory = await db
      .select({ id: subjectCategories.id })
      .from(subjectCategories)
      .where(eq(subjectCategories.id, params.id))
      .limit(1);
    
    if (existingCategory.length === 0) {
      return NextResponse.json({ error: 'Subject category not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    
    if (updates.priceModifier !== undefined) {
      updateData.priceModifier = updates.priceModifier.toString();
    }
    
    // Update the category
    const updatedCategory = await db
      .update(subjectCategories)
      .set(updateData)
      .where(eq(subjectCategories.id, params.id))
      .returning();
    
    return NextResponse.json({
      message: 'Subject category updated successfully',
      category: updatedCategory[0],
    });
  } catch (error) {
    console.error('Error updating subject category:', error);
    return NextResponse.json({
      error: 'Failed to update subject category',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Delete a subject category
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the category exists
    const existingCategory = await db
      .select({ id: subjectCategories.id })
      .from(subjectCategories)
      .where(eq(subjectCategories.id, params.id))
      .limit(1);
    
    if (existingCategory.length === 0) {
      return NextResponse.json({ error: 'Subject category not found' }, { status: 404 });
    }
    
    // Delete the category
    await db
      .delete(subjectCategories)
      .where(eq(subjectCategories.id, params.id));
    
    return NextResponse.json({
      message: 'Subject category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subject category:', error);
    return NextResponse.json({
      error: 'Failed to delete subject category',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 