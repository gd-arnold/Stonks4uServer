import { AppDataSource } from './config/data-source';

export const connectToDB = async () => {
	try {
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
	} catch (error) {
		throw new Error(`Connecting to DB failed.\n${error}`);
	}
};

// WARNING: Used ONLY for testing purposes
export const resetDB = async () => {
	try {
		const entities = AppDataSource.entityMetadatas;

		for (const entity of entities) {
			const repository = AppDataSource.getRepository(entity.name);
			await repository.clear();
		}

		return true;
	} catch (error) {
		throw new Error(`Cleaning DB failed.\n${error}`);
	}
};
