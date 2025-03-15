import { NextResponse } from 'next/server';
import { initializeAdminUser } from '@/src/lib/admin/init-admin';

// Initialize admin user during server startup
let initialized = false;

// Self-executing initialization
(async () => {
  if (!initialized) {
    try {
      initialized = await initializeAdminUser();
      console.log('Admin user auto-initialization completed');
    } catch (error) {
      console.error('Error during admin auto-initialization:', error);
    }
  }
})();

export async function GET() {
  return NextResponse.json({
    success: initialized,
    message: initialized 
      ? 'Admin initialization completed successfully' 
      : 'Admin initialization failed or is pending'
  });
} 