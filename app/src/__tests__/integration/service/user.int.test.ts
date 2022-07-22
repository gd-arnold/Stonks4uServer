import { randomUUID } from 'crypto';
import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { User } from '../../../entity/User';
import { findUserByEmail, findUserById, save } from '../../../service/User';
import { TestDBContainer } from '../../utils/dbcontainer.utils';

describe('User service suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();
	let savedUser: User;

	beforeAll(async () => {
		await dbContainer.start();
		await Database.connect();
	});

	afterAll(async () => {
		await Database.disconnect();
		await dbContainer.stop();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(User);
		const testUser = {
			email: 'test@test.com',
			fullName: 'Test Test',
			passwordHash: 'test',
		};

		return { repo, testUser };
	};

	test('Saves user in database', async () => {
		const { repo, testUser } = setup();

		await save(testUser);

		savedUser = (await repo.findOneBy({ email: testUser.email })) as User;

		(Object.keys(testUser) as Array<keyof typeof testUser>).forEach((key) => {
			expect(savedUser[key]).toBe(testUser[key]);
		});
	});

	test('Finds user by email', async () => {
		const foundUser = (await findUserByEmail(savedUser.email)) as User;
		const notFoundUser = await findUserByEmail('invalid');

		(Object.keys(savedUser) as Array<keyof typeof savedUser>).forEach((key) => {
			expect(foundUser[key]).toEqual(savedUser[key]);
		});

		expect(notFoundUser).toBe(null);
	});

	test('Finds user by id', async () => {
		const foundUser = (await findUserById(savedUser.id)) as User;
		const notFoundUser = await findUserById(randomUUID());

		(Object.keys(savedUser) as Array<keyof typeof savedUser>).forEach((key) => {
			expect(foundUser[key]).toEqual(savedUser[key]);
		});

		expect(notFoundUser).toBe(null);
	});
});
