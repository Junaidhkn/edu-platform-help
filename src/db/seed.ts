import db from '@/src/db';
import { adminUserEmailAddresses } from '@/src/db/schema/user';
import env from '@/src/env';

const main = async () => {
  try {
    console.log('Seeding database...');
    
    // Get admin email addresses from environment variable
    const adminEmails = env.ADMIN_EMAIL_ADDRESSES.split(',').map(email => email.trim());
    
    // Insert admin email addresses
    for (const email of adminEmails) {
      // Check if email already exists
      const existingAdmin = await db.query.adminUserEmailAddresses.findFirst({
        where: (table, { eq }) => eq(table.email, email)
      });
      
      if (!existingAdmin) {
        await db.insert(adminUserEmailAddresses).values({
          email: email
        });
        console.log(`Added admin email: ${email}`);
      } else {
        console.log(`Admin email already exists: ${email}`);
      }
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

main(); 