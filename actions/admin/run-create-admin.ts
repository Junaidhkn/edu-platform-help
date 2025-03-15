'use server';

import { createAdminUser } from './create-admin-user';

export async function runCreateAdminAction() {
  return createAdminUser();
} 