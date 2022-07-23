import { randomUUID } from 'crypto';
import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { StatementCategory } from '../../../entity/StatementCategory';
import { User } from '../../../entity/User';
import { StatementCategoryService } from '../../../service/StatementCategory';
import { TestDBContainer } from '../../utils/dbcontainer.utils';
import { generateUser } from '../../utils/user.utils';

describe('Statement category service suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();
	let testUser: User = {} as User;
	let savedIncomeCategory: StatementCategory;
	let savedExpenseCategory: StatementCategory;

	beforeAll(async () => {
		await dbContainer.start();
		await Database.connect();
		testUser = await generateUser();
	});

	afterAll(async () => {
		await Database.disconnect();
		await dbContainer.stop();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(StatementCategory);
		const testIncomeCategory: Partial<StatementCategory> = {
			id: randomUUID(),
			name: 'TestI',
			type: 'income',
			user: testUser,
		};
		const testExpenseCategory: Partial<StatementCategory> = {
			id: randomUUID(),
			name: 'TestE',
			type: 'expense',
			user: testUser,
		};
		return { repo, testIncomeCategory, testExpenseCategory };
	};

	test('Saves category in database', async () => {
		const { repo, testIncomeCategory, testExpenseCategory } = setup();

		for (const category of [testIncomeCategory, testExpenseCategory]) {
			await StatementCategoryService.save(category);

			const savedCategory = (await repo
				.createQueryBuilder('statement_categories')
				.leftJoinAndSelect('statement_categories.user', 'users')
				.where('statement_categories.id = :id', { id: category.id })
				.getOne()) as Partial<StatementCategory>;

			(Object.keys(category) as Array<keyof typeof category>).forEach((key) => {
				expect(savedCategory[key]).toEqual(category[key]);
			});

			if (savedCategory.type === 'income') {
				delete savedCategory.user;
				savedIncomeCategory = savedCategory as StatementCategory;
			} else {
				delete savedCategory.user;
				savedExpenseCategory = savedCategory as StatementCategory;
			}
		}
	});

	test('Updates category', async () => {
		const { repo } = setup();

		const updated = { ...savedExpenseCategory, name: 'TestExpense' };

		await StatementCategoryService.update(savedExpenseCategory.id, {
			name: updated.name,
			type: updated.type,
		});

		savedExpenseCategory = (await repo.findOneBy({
			id: savedExpenseCategory.id,
		})) as StatementCategory;

		updated.updatedAt = savedExpenseCategory.updatedAt;

		expect(savedExpenseCategory).toEqual(updated);
	});

	test('Deletes category', async () => {
		const { repo } = setup();

		await StatementCategoryService.delete(savedExpenseCategory.id);

		expect(await repo.findOneBy({ id: savedExpenseCategory.id })).toBe(null);

		// Restore deleted category
		savedExpenseCategory.user = testUser;
		await repo.save(savedExpenseCategory);
		savedExpenseCategory = (await repo.findOneBy({
			id: savedExpenseCategory.id,
		})) as StatementCategory;
	});

	test('Gets custom category', async () => {
		expect(await StatementCategoryService.getCustomCategory(randomUUID(), testUser.id)).toEqual(
			null
		);
		expect(
			await StatementCategoryService.getCustomCategory(savedIncomeCategory.id, randomUUID())
		).toEqual(null);
		expect(
			await StatementCategoryService.getCustomCategory(savedIncomeCategory.id, testUser.id)
		).toEqual(savedIncomeCategory);
	});

	test('Gets default statement categories', async () => {
		const { repo } = setup();

		const defaultCategoriesQuery = repo
			.createQueryBuilder('statement_categories')
			.where('statement_categories.userId IS NULL');

		expect(await StatementCategoryService.getDefaultCategories()).toEqual(
			await defaultCategoriesQuery.getMany()
		);
		expect(await StatementCategoryService.getDefaultCategories('income')).toEqual(
			await defaultCategoriesQuery
				.andWhere('statement_categories.type = :type', { type: 'income' })
				.getMany()
		);
		expect(await StatementCategoryService.getDefaultCategories('expense')).toEqual(
			await defaultCategoriesQuery
				.andWhere('statement_categories.type = :type', { type: 'expense' })
				.getMany()
		);
	});

	test('Gets custom statement categories', async () => {
		expect(await StatementCategoryService.getCustomCategories(testUser.id)).toEqual([
			savedIncomeCategory,
			savedExpenseCategory,
		]);
		expect(await StatementCategoryService.getCustomCategories(testUser.id, 'income')).toEqual([
			savedIncomeCategory,
		]);
		expect(await StatementCategoryService.getCustomCategories(testUser.id, 'expense')).toEqual([
			savedExpenseCategory,
		]);
	});

	test('Gets all statement categories', async () => {
		const { repo } = setup();

		const defaultCategoriesQuery = repo
			.createQueryBuilder('statement_categories')
			.where('statement_categories.userId IS NULL');

		expect(await StatementCategoryService.getCategories(testUser.id)).toEqual([
			...(await defaultCategoriesQuery.getMany()),
			savedIncomeCategory,
			savedExpenseCategory,
		]);
		expect(await StatementCategoryService.getCategories(testUser.id, 'income')).toEqual([
			...(await defaultCategoriesQuery
				.andWhere('statement_categories.type = :type', { type: 'income' })
				.getMany()),
			savedIncomeCategory,
		]);
		expect(await StatementCategoryService.getCategories(testUser.id, 'expense')).toEqual([
			...(await defaultCategoriesQuery
				.andWhere('statement_categories.type = :type', { type: 'expense' })
				.getMany()),
			savedExpenseCategory,
		]);
	});
});
