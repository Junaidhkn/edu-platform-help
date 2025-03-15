import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { USER_ROLES } from '@/lib/constants';
import db from '@/src/db';
import { adminUserEmailAddresses, user } from '@/src/db/schema/user';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const isAdmin = session.user.role === USER_ROLES.ADMIN;
    
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { email } = body;
    
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Check if the email already exists in the adminUserEmailAddresses table
    const existingAdmin = await db
      .select()
      .from(adminUserEmailAddresses)
      .where(eq(adminUserEmailAddresses.email, email.toLowerCase()));
    
    if (existingAdmin.length > 0) {
      return NextResponse.json(
        { success: true, message: `${email} is already an admin` }
      );
    }
    
    // Add the email to the adminUserEmailAddresses table
    await db.insert(adminUserEmailAddresses).values({
      email: email.toLowerCase(),
    });
    
    // If the user already exists, update their role to admin
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email.toLowerCase()));
    
    if (existingUser.length > 0) {
      await db
        .update(user)
        .set({ role: USER_ROLES.ADMIN })
        .where(eq(user.email, email.toLowerCase()));
        
      return NextResponse.json({
        success: true,
        message: `${email} has been made an admin and their role has been updated`,
      });
    }
    
    return NextResponse.json({
      success: true,
      message: `${email} has been added as an admin. They will have admin privileges when they sign up.`,
    });
  } catch (error) {
    console.error('Error adding admin user:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
} 