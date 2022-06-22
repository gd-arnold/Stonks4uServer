import { createApp } from '../../../app';
import { AppDataSource } from '../../../config/data-source';
import { connectToDB, resetDB } from '../../../db';
import { User } from '../../../entity/user';
import { findUserByEmail, save } from '../../../service/user';

describe('User service suite', () => {
	beforeAll(async () => {
		await connectToDB();
		await resetDB();
		createApp();
	});

	afterAll(async () => {
		await resetDB();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(User);

		const testUser = {
			email: 'test@test.com',
			fullName: 'Test Test',
			passwordHash: 'test',
		};

		return { testUser, repo };
	};

	test('Saves user in database', async () => {
		const { testUser, repo } = setup();
		await save(testUser);

		const savedUser = (await repo.findOneBy({ email: testUser.email })) as User;

		(Object.keys(testUser) as Array<keyof typeof testUser>).forEach((key) => {
			expect(savedUser[key]).toBe(testUser[key]);
		});
	});

	test('Finds user by email', async () => {
		const { testUser } = setup();

		const foundUser = (await findUserByEmail(testUser.email)) as User;
		const notFoundUser = await findUserByEmail('invalid');

		(Object.keys(testUser) as Array<keyof typeof testUser>).forEach((key) => {
			expect(foundUser[key]).toEqual(testUser[key]);
		});

		expect(notFoundUser).toBe(null);
	});
});
