# Stripe Integration Guide

This guide explains how to properly set up Stripe integration in this Next.js application.

## 1. Environment Variables

Add the following to your `.env.local` file:

```
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
# Optional but recommended for production
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 2. Current Implementation Status

We've set up the following files:

- `src/lib/stripe-server.ts` - Server-side Stripe client
- `src/lib/stripe-client.ts` - Client-side Stripe loader (not used directly)
- `src/components/payment/StripeProvider.tsx` - Provider component for React Stripe.js
- `src/components/payment/checkout-button.tsx` - Button component for Stripe Checkout
- `src/app/api/checkout/route.ts` - API route for creating checkout sessions
- `src/app/api/webhooks/stripe/route.ts` - Webhook handler for Stripe events
- `src/app/profile/orders/success/page.tsx` - Success page after payment
- `src/app/profile/orders/cancel/page.tsx` - Cancellation page for abandoned payments
- `src/app/profile/place-order/checkout/page.tsx` - Checkout page for orders

## 3. TypeScript Issues

There are some TypeScript issues with the current implementation that need to be resolved:

1. The Stripe type definitions in the API routes need to be fixed (session creation and webhook handling)
2. The import paths need to be aligned between different parts of the application
3. The database schema interactions need to be updated to match the exact schema types

## 4. Next Steps

1. Install the latest Stripe types package:
   ```
   npm install --save-dev @types/stripe
   ```

2. Ensure the import paths are consistent:
   - Use either `@/components/payment/checkout-button` or `@/components/payment` consistently
   - Fix any casing issues in file paths

3. Fix the Stripe API client initialization:
   - Ensure proper typing for the Stripe client
   - Fix the API type errors for session creation

4. Fix the database interaction:
   - Review your schema types
   - Ensure the transaction insert is properly typed
   - Add proper null/undefined checks

5. Add Stripe Elements integration:
   - Use the StripeProvider component at the layout level
   - Add Elements components for direct card payments

## 5. Debugging

If you encounter TypeScript errors, check:

1. That the Stripe version in your code matches the version in your `package.json`
2. That all property names match exactly what the Stripe API expects
3. That all database field types match your schema definition

## 6. Testing the Integration

1. Test the checkout flow from an order page
2. Use the Stripe test card numbers (e.g., 4242 4242 4242 4242) for testing
3. Verify webhook handling with Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`) 