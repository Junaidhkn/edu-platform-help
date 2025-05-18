import Stripe from 'stripe';

// Use the current Stripe API version
const STRIPE_API_VERSION = '2025-02-24.acacia' as Stripe.LatestApiVersion;

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: STRIPE_API_VERSION,
  typescript: true, // Enable better TypeScript support
});

export default stripe; 