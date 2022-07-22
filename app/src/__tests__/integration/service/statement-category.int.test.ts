import { randomUUID } from 'crypto';
import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { StatementCategory } from '../../../entity/StatementCategory';
import { User } from '../../../entity/User';
import { getDefaultStatementCategories, save } from '../../../service/StatementCategory';
import { TestDBContainer } from '../../utils/dbcontainer.utils';
import { generateUser } from '../../utils/user.utils';

describe('Statement category service suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();
	let testUser: User = {} as User;
	let testCategory: Partial<StatementCategory> = {};

	beforeAll(async () => {
		await dbContainer.start();
		await Database.connect();
		testUser = await generateUser();
		testCategory = {
			id: randomUUID(),
			name: 'test',
			type: 'income',
			user: testUser,
		};
	});

	afterAll(async () => {
		await Database.disconnect();
		await dbContainer.stop();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(StatementCategory);

		return { repo };
	};

	test('Saves category in database', async () => {
		const { repo } = setup();

		await save(testCategory);

		const savedCategory = (await repo
			.createQueryBuilder('statement_categories')
			.leftJoinAndSelect('statement_categories.user', 'users')
			.where('statement_categories.id = :id', { id: testCategory.id })
			.getOne()) as StatementCategory;

		(Object.keys(testCategory) as Array<keyof typeof testCategory>).forEach((key) => {
			expect(savedCategory[key]).toEqual(testCategory[key]);
		});
	});

	test('Gets default statement categories', async () => {
		const { repo } = setup();

		const defaultCategoriesQuery = repo
			.createQueryBuilder('statement_categories')
			.where('statement_categories.userId IS NULL');

		expect(await getDefaultStatementCategories()).toEqual(await defaultCategoriesQuery.getMany());
		expect(await getDefaultStatementCategories('income')).toEqual(
			await defaultCategoriesQuery
				.andWhere('statement_categories.type = :type', { type: 'income' })
				.getMany()
		);
		expect(await getDefaultStatementCategories('expense')).toEqual(
			await defaultCategoriesQuery
				.andWhere('statement_categories.type = :type', { type: 'expense' })
				.getMany()
		);
	});
});
