import { AppDataSource } from './config/data-source';

const Database = {
	connect: async () => {
		try {
			await AppDataSource.initialize();
			await AppDataSource.runMigrations();
		} catch (error) {
			throw new Error(`Connecting to DB failed.\n${error}`);
		}
	},
	disconnect: async () => {
		try {
			await AppDataSource.destroy();
		} catch (error) {
			throw new Error(`Disconnecting from DB failed.\n${error}`);
		}
	},
};

export default Database;
