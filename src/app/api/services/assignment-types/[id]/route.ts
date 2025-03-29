import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
import { assignmentTypes } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Validation schema for updating an assignment type
const updateAssignmentTypeSchema = z.object({
  name: z.string().min(2).optional(),
  priceAdjustment: z.number().min(0).max(1000).optional(),
});

// Get a specific assignment type
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

    const type = await db
      .select()
      .from(assignmentTypes)
      .where(eq(assignmentTypes.id, params.id))
      .limit(1)
      .then((results) => results[0] || null);
    
    if (!type) {
      return NextResponse.json({ error: 'Assignment type not found' }, { status: 404 });
    }
    
    return NextResponse.json(type);
  } catch (error) {
    console.error('Error fetching assignment type:', error);
    return NextResponse.json({
      error: 'Failed to fetch assignment type',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Update an assignment type
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
    const validationResult = updateAssignmentTypeSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const updates = validationResult.data;
    
    // Check if the assignment type exists
    const existingType = await db
      .select({ id: assignmentTypes.id })
      .from(assignmentTypes)
      .where(eq(assignmentTypes.id, params.id))
      .limit(1);
    
    if (existingType.length === 0) {
      return NextResponse.json({ error: 'Assignment type not found' }, { status: 404 });
    }
    
    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    
    if (updates.name !== undefined) {
      updateData.name = updates.name;
    }
    
    if (updates.priceAdjustment !== undefined) {
      updateData.priceAdjustment = updates.priceAdjustment.toString();
    }
    
    // Update the assignment type
    const updatedType = await db
      .update(assignmentTypes)
      .set(updateData)
      .where(eq(assignmentTypes.id, params.id))
      .returning();
    
    return NextResponse.json({
      message: 'Assignment type updated successfully',
      assignmentType: updatedType[0],
    });
  } catch (error) {
    console.error('Error updating assignment type:', error);
    return NextResponse.json({
      error: 'Failed to update assignment type',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Delete an assignment type
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
    
    // Check if the assignment type exists
    const existingType = await db
      .select({ id: assignmentTypes.id })
      .from(assignmentTypes)
      .where(eq(assignmentTypes.id, params.id))
      .limit(1);
    
    if (existingType.length === 0) {
      return NextResponse.json({ error: 'Assignment type not found' }, { status: 404 });
    }
    
    // Delete the assignment type
    await db
      .delete(assignmentTypes)
      .where(eq(assignmentTypes.id, params.id));
    
    return NextResponse.json({
      message: 'Assignment type deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment type:', error);
    return NextResponse.json({
      error: 'Failed to delete assignment type',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 