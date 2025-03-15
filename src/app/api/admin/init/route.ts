import { NextResponse } from 'next/server';
import db from '@/src/db';
import { adminUserEmailAddresses, lower } from '@/src/db/schema/user';
import { eq } from 'drizzle-orm';

// Initialize the admin email from the .env file
async function initializeAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL_ADDRESSES;
    
    if (!adminEmail) {
      return {
        success: false,
        message: 'ADMIN_EMAIL_ADDRESSES environment variable is not set'
      };
    }
    
    // Check if admin email already exists in the table
    const existingAdmin = await db
      .select()
      .from(adminUserEmailAddresses)
      .where(eq(lower(adminUserEmailAddresses.email), adminEmail.toLowerCase()));
    
    // If admin email doesn't exist, add it
    if (existingAdmin.length === 0) {
      await db.insert(adminUserEmailAddresses).values({
        email: adminEmail.toLowerCase(),
      });
      
      return { 
        success: true, 
        message: `Admin email ${adminEmail} added successfully` 
      };
    }
    
    return { 
      success: true, 
      message: `Admin email ${adminEmail} already exists` 
    };
  } catch (error) {
    console.error('Error initializing admin user:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

// Call on app startup using an API route
export async function GET() {
  const result = await initializeAdmin();
  
  return NextResponse.json(result);
} 