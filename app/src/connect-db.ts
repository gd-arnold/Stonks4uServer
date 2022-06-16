import { AppDataSource } from './config/data-source';

export const connectToDB = async () => {
	try {
		await AppDataSource.initialize();
	} catch (error) {
		throw new Error(`Connecting to DB failed.\n${error}`);
	}
};
