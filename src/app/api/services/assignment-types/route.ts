import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
import { assignmentTypes } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Validation schema for assignment types
const assignmentTypeSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  priceAdjustment: z.number().min(0).max(1000),
});

// Get all assignment types
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const types = await db.select().from(assignmentTypes).orderBy(assignmentTypes.name);
    
    return NextResponse.json(types);
  } catch (error) {
    console.error('Error fetching assignment types:', error);
    return NextResponse.json({
      error: 'Failed to fetch assignment types',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Create a new assignment type
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = assignmentTypeSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const { id, name, priceAdjustment } = validationResult.data;
    
    // Check if the assignment type ID already exists
    const existingType = await db
      .select({ id: assignmentTypes.id })
      .from(assignmentTypes)
      .where(eq(assignmentTypes.id, id))
      .limit(1);
    
    if (existingType.length > 0) {
      return NextResponse.json({
        error: 'Assignment type with this ID already exists',
      }, { status: 409 });
    }
    
    // Create the new assignment type
    const newType = await db
      .insert(assignmentTypes)
      .values({
        id,
        name,
        priceAdjustment: priceAdjustment.toString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return NextResponse.json({
      message: 'Assignment type created successfully',
      assignmentType: newType[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment type:', error);
    return NextResponse.json({
      error: 'Failed to create assignment type',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 