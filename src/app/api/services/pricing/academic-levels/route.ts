import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { z } from 'zod';
import db from '@/src/db';
import { academicLevels } from '@/src/db/schema';
import { eq } from 'drizzle-orm';

// Validation schema for the academic level
const academicLevelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  basePrice: z.number().min(0).max(1000),
});

// Get all academic levels
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const levels = await db.select().from(academicLevels).orderBy(academicLevels.name);
    
    return NextResponse.json(levels);
  } catch (error) {
    console.error('Error fetching academic levels:', error);
    return NextResponse.json({
      error: 'Failed to fetch academic levels',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Create a new academic level
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = academicLevelSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Validation error',
        details: validationResult.error.format(),
      }, { status: 400 });
    }
    
    const { id, name, basePrice } = validationResult.data;
    
    // Check if the academic level ID already exists
    const existingLevel = await db
      .select({ id: academicLevels.id })
      .from(academicLevels)
      .where(eq(academicLevels.id, id))
      .limit(1);
    
    if (existingLevel.length > 0) {
      return NextResponse.json({
        error: 'Academic level with this ID already exists',
      }, { status: 409 });
    }
    
    // Create the new academic level
    const newLevel = await db
      .insert(academicLevels)
      .values({
        id,
        name,
        basePrice: basePrice.toString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();
    
    return NextResponse.json({
      message: 'Academic level created successfully',
      academicLevel: newLevel[0],
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating academic level:', error);
    return NextResponse.json({
      error: 'Failed to create academic level',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 