import { NextResponse } from 'next/server';
import { initializeAdminUser } from '@/src/lib/admin/init-admin';
import { auth } from '@/auth';
import { USER_ROLES } from '@/lib/constants';

export async function GET() {
  try {
    // Check if the default admin has been initialized
    const isInitialized = await initializeAdminUser();
    
    // Get the current user's admin status
    const session = await auth();
    const isUserAdmin = session?.user?.role === USER_ROLES.ADMIN;
    
    return NextResponse.json({
      initialized: isInitialized,
      isAdmin: isUserAdmin,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role
      } : null
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json(
      { error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
} 