import 'server-only';
import db from '@/src/db';
import { adminUserEmailAddresses, lower } from '@/src/db/schema/user';
import { eq } from 'drizzle-orm';

export async function createAdminUser() {
  try {
    // Get admin email from environment variable
    const adminEmail = process.env.ADMIN_EMAIL_ADDRESSES;
    
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL_ADDRESSES environment variable is not set');
    }
    
    // Check if admin email already exists in the table
    const existingAdmin = await db
      .select()
      .from(adminUserEmailAddresses)
      .where(eq(lower(adminUserEmailAddresses.email), adminEmail.toLowerCase()));
    
    // If admin email doesn't exist, add it
    if (existingAdmin.length === 0) {
      await db.insert(adminUserEmailAddresses).values({
        email: adminEmail,
      });
      
      return { success: true, message: `Admin email ${adminEmail} added successfully` };
    }
    
    return { success: true, message: `Admin email ${adminEmail} already exists` };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
} 