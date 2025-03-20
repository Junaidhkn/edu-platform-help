// This file provides additional type declarations for Stripe
// to help TypeScript understand our usage

import { Stripe } from 'stripe';

declare module 'stripe' {
  // Extend the Checkout.Session type to make url non-optional
  namespace Stripe {
    namespace Checkout {
      interface Session {
        url: string;
      }
    }
  }
} 