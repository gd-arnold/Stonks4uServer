import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { User } from '../../../entity/User';
import { findUserByEmail, save } from '../../../service/User';
import { TestDBContainer } from '../../utils/dbcontainer.utils';

describe('User service suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();

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
