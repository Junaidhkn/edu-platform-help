/**
 * This script runs the Stripe migration
 * Usage: node scripts/migrate-stripe.js
 */

const { execSync } = require('child_process');

console.log('Running Stripe migration...');

try {
  // Run the migration
  execSync('npx tsx src/db/migrations/add-stripe-fields.ts', { stdio: 'inherit' });
  console.log('Migration completed successfully.');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
} 