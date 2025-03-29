import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
import { academicLevels } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Validation schema for updating an academic level
const updateAcademicLevelSchema = z.object({
  name: z.string().min(2).optional(),
  basePrice: z.number().min(0).max(1000).optional(),
});

// Get a specific academic level
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

    const level = await db
      .select()
      .from(academicLevels)
      .where(eq(academicLevels.id, params.id))
      .limit(1)
      .then((results) => results[0] || null);
    
    if (!level) {
      return NextResponse.json({ error: 'Academic level not found' }, { status: 404 });
    }
    
    return NextResponse.json(level);
  } catch (error) {
    console.error('Error fetching academic level:', error);
    return NextResponse.json({
      error: 'Failed to fetch academic level',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Update an academic level
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
    const validationResult = updateAcademicLevelSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const updates = validationResult.data;
    
    // Check if the academic level exists
    const existingLevel = await db
      .select({ id: academicLevels.id })
      .from(academicLevels)
      .where(eq(academicLevels.id, params.id))
      .limit(1);
    
    if (existingLevel.length === 0) {
      return NextResponse.json({ error: 'Academic level not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    
    if (updates.basePrice !== undefined) {
      updateData.basePrice = updates.basePrice.toString();
    }
    
    // Update the academic level
    const updatedLevel = await db
      .update(academicLevels)
      .set(updateData)
      .where(eq(academicLevels.id, params.id))
      .returning();
    
    return NextResponse.json({
      message: 'Academic level updated successfully',
      academicLevel: updatedLevel[0],
    });
  } catch (error) {
    console.error('Error updating academic level:', error);
    return NextResponse.json({
      error: 'Failed to update academic level',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Delete an academic level
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
    
    // Check if the academic level exists
    const existingLevel = await db
      .select({ id: academicLevels.id })
      .from(academicLevels)
      .where(eq(academicLevels.id, params.id))
      .limit(1);
    
    if (existingLevel.length === 0) {
      return NextResponse.json({ error: 'Academic level not found' }, { status: 404 });
    }
    
    // Delete the academic level
    await db
      .delete(academicLevels)
      .where(eq(academicLevels.id, params.id));
    
    return NextResponse.json({
      message: 'Academic level deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting academic level:', error);
    return NextResponse.json({
      error: 'Failed to delete academic level',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 