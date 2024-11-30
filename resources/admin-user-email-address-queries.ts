import 'server-only';
import db from '@/src/db';
import { adminUserEmailAddresses, lower } from '@/src/db/schema/user';

export const findAdminUserEmailAddresses = async () => {
	const adminUserEmailAddress = await db
		.select({ email: lower(adminUserEmailAddresses.email) })
		.from(adminUserEmailAddresses);

	return adminUserEmailAddress.map((item) => item.email as string);
};
