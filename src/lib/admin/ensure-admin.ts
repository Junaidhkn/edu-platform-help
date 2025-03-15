import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { USER_ROLES } from '@/lib/constants';
import { initializeAdminUser } from './init-admin';

/**
 * Helper function to ensure the user is an admin and initialize the admin user
 * To be used in server components and server actions
 */
export async function ensureAdmin(options: { redirectOnFailure?: boolean } = {}) {
  const { redirectOnFailure = true } = options;
  
  // Initialize the admin user from .env
  await initializeAdminUser();
  
  // Check if the current user is authenticated and is an admin
  const session = await auth();
  const isAdmin = session?.user?.role === USER_ROLES.ADMIN;
  
  // Redirect if not logged in or not an admin
  if (redirectOnFailure) {
    if (!session || !session.user) {
      redirect('/auth/signin');
    }
    
    if (!isAdmin) {
      redirect('/');
    }
  }
  
  return { 
    isAuthenticated: !!session?.user,
    isAdmin,
    user: session?.user || null
  };
} 