import { randomUUID } from 'crypto';
import { AppDataSource } from '../../config/data-source';
import { User } from '../../entity/User';

const repo = AppDataSource.getRepository(User);

export const createUser = (overrides: Partial<User> = {}) => {
	return repo.create({
		email: `${randomUUID()}@t.com`,
		fullName: 'Test Test',
		passwordHash: 'test',
		...overrides,
	});
};

export const createSavedUser = async (overrides: Partial<User> = {}) => {
	const user = createUser(overrides);
	await repo.save(user);

	return user;
};
