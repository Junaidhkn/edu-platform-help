import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import env from '@/src/env';

const main = async () => {
  try {
    const sql = neon(env.DATABASE_URL);
    
    // Try to create the role enum type if it doesn't exist
    try {
      const migrationPath1 = path.join(process.cwd(), 'src', 'db', 'migrations', '0000_create_role_enum.sql');
      const migrationSql1 = fs.readFileSync(migrationPath1, 'utf8');
      await sql(migrationSql1);
      console.log('Role enum type created successfully');
    } catch (error) {
      if (error.code === '42710') { // Type already exists
        console.log('Role enum type already exists, skipping...');
      } else {
        throw error;
      }
    }
    
    // Try to create the availability_status enum type if it doesn't exist
    try {
      const migrationPath2 = path.join(process.cwd(), 'src', 'db', 'migrations', '0001_create_availability_status_enum.sql');
      const migrationSql2 = fs.readFileSync(migrationPath2, 'utf8');
      await sql(migrationSql2);
      console.log('Availability status enum type created successfully');
    } catch (error) {
      if (error.code === '42710') { // Type already exists
        console.log('Availability status enum type already exists, skipping...');
      } else {
        throw error;
      }
    }
    
    console.log('Manual migrations completed');
  } catch (error) {
    console.error('Error running manual migrations', error);
    process.exit(1);
  }
};

main(); 