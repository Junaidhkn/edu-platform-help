import db from '@/src/db';
import { migrate } from 'drizzle-orm/neon-http/migrator';

const main = async () => {
	try {
		await migrate(db, {
			migrationsFolder: './src/db/migrations',
		});
		console.log('Migrations ran successfully');
	} catch (error) {
		console.error('Error running migrations', error);
		process.exit(1);
	}
};

main();
