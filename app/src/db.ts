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
	// WARNING: Used ONLY for testing purposes
	reset: async () => {
		try {
			const entities = AppDataSource.entityMetadatas;

			for (const entity of entities) {
				const repository = AppDataSource.getRepository(entity.name);
				await repository.query(`TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`);
			}

			return true;
		} catch (error) {
			throw new Error(`Cleaning DB failed.\n${error}`);
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
