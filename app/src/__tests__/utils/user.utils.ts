import { randomUUID } from 'crypto';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../entity/User';

const repo = AppDataSource.getRepository(User);

export const generateUser = async () => {
	const testUser = repo.create({
		email: `${randomUUID()}@t.com`,
		fullName: 'Test Test',
		passwordHash: 'test',
	});

	await repo.save(testUser);
	return testUser;
};
