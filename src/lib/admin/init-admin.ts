import 'server-only';
import db from '@/src/db';
import { adminUserEmailAddresses, lower } from '@/src/db/schema/user';
import { eq } from 'drizzle-orm';

export async function initializeAdminUser() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL_ADDRESSES;
    
    if (!adminEmail) {
      console.error('ADMIN_EMAIL_ADDRESSES environment variable is not set');
      return false;
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
      
      console.log(`Admin email ${adminEmail} added successfully`);
      return true;
    }
    
    // Admin already exists
    return true;
  } catch (error) {
    console.error('Error initializing admin user:', error);
    return false;
  }
} 