import Database from '../../../db';
import { Request } from 'express';
import { TestDBContainer } from '../../utils/dbcontainer.utils';
import { buildResponse } from '../../utils/express.utils';
import { StatementCategoryController } from '../../../controller/StatementCategory';
import { AppDataSource } from '../../../config/data-source';
import { StatementCategory } from '../../../entity/StatementCategory';
import { User } from '../../../entity/User';
import { createSavedUser } from '../../utils/user.utils';
import { StatementCategoryDTO } from '../../../dto/StatementCategory';
import { randomUUID } from 'crypto';

describe('Statement category controller suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();
	let testUser: User = {} as User;
	let userPayload: IUserPayload;
	let savedIncomeCategory: StatementCategory;
	let savedExpenseCategory: StatementCategory;

	beforeAll(async () => {
		await dbContainer.start();
		await Database.connect();
		testUser = await createSavedUser();
		userPayload = {
			id: testUser.id,
			email: testUser.email,
		};
	});

	afterAll(async () => {
		await Database.disconnect();
		await dbContainer.stop();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(StatementCategory);
		const testIncomeCategoryDTO: StatementCategoryDTO = {
			name: 'TestI',
			type: 'income',
		};
		const testExpenseCategoryDTO: StatementCategoryDTO = {
			name: 'TestE',
			type: 'expense',
		};
		return { repo, testIncomeCategoryDTO, testExpenseCategoryDTO };
	};

	describe('Create custom category suite', () => {
		test("Doesn't create category on invalid user id", async () => {
			const { testIncomeCategoryDTO } = setup();

			const req = {
				params: { userId: 'invalid' },
				body: testIncomeCategoryDTO,
				userPayload,
			} as any;
			const res = buildResponse();

			await StatementCategoryController.post(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Successfully creates custom category', async () => {
			const { repo, testIncomeCategoryDTO, testExpenseCategoryDTO } = setup();

			for (const category of [testIncomeCategoryDTO, testExpenseCategoryDTO]) {
				const req = { params: { userId: testUser.id }, body: category, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.post(req, res);

				expect(res.status).toHaveBeenCalledWith(201);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'The category is successully created.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			}

			savedIncomeCategory = (await repo
				.createQueryBuilder('statement_categories')
				.where('statement_categories.name = :name', { name: testIncomeCategoryDTO.name })
				.getOne()) as StatementCategory;

			savedExpenseCategory = (await repo
				.createQueryBuilder('statement_categories')
				.where('statement_categories.name = :name', { name: testExpenseCategoryDTO.name })
				.getOne()) as StatementCategory;
		});
	});

	describe('Update custom category suite', () => {
		test("Doesn't update category on invalid category id", async () => {
			const req = {
				params: { id: 'invalid' },
				body: { ...savedExpenseCategory, name: 'TestExpense' },
				userPayload,
			} as any;
			const res = buildResponse();

			await StatementCategoryController.put(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid category id' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test("Doesn't update invalid category", async () => {
			const req = {
				params: { id: randomUUID() },
				body: { ...savedExpenseCategory, name: 'TestExpense' },
				userPayload,
			} as any;
			const res = buildResponse();

			await StatementCategoryController.put(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Successfully updates custom category', async () => {
			const { repo } = setup();

			const req = {
				params: { id: savedExpenseCategory.id },
				body: { ...savedExpenseCategory, name: 'TestExpense' },
				userPayload,
			} as any;
			const res = buildResponse();

			await StatementCategoryController.put(req, res);

			savedExpenseCategory = (await repo.findOneBy({
				id: savedExpenseCategory.id,
			})) as StatementCategory;

			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledTimes(0);
		});
	});

	describe('Delete custom category suite', () => {
		test("Doesn't delete category on invalid category id", async () => {
			const req = {
				params: { id: 'invalid' },
				body: { ...savedExpenseCategory, name: 'TestExpense' },
				userPayload,
			} as any;
			const res = buildResponse();

			await StatementCategoryController.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid category id' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test("Doesn't delete invalid category", async () => {
			const req = {
				params: { id: randomUUID() },
				body: { ...savedExpenseCategory, name: 'TestExpense' },
				userPayload,
			} as any;
			const res = buildResponse();

			await StatementCategoryController.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Successfully deletes custom category', async () => {
			const { repo } = setup();

			const req = { params: { id: savedExpenseCategory.id }, userPayload } as any;
			const res = buildResponse();

			await StatementCategoryController.delete(req, res);

			expect(res.status).toHaveBeenCalledWith(204);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.send).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledTimes(0);

			// Restore deleted category
			await repo.restore(savedExpenseCategory.id);
			savedExpenseCategory = (await repo.findOneBy({
				id: savedExpenseCategory.id,
			})) as StatementCategory;
		});
	});

	describe('Get default categories suite', () => {
		test('Returns all default categories', async () => {
			const { repo } = setup();

			const req = {} as Request;
			const res = buildResponse();
			await StatementCategoryController.get.default.all(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				categories: await repo
					.createQueryBuilder('statement_categories')
					.where('statement_categories.userId IS NULL')
					.getMany(),
			});
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Returns income default categories', async () => {
			const { repo } = setup();

			const req = {} as Request;
			const res = buildResponse();
			await StatementCategoryController.get.default.income(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				categories: await repo
					.createQueryBuilder('statement_categories')
					.where('statement_categories.userId IS NULL')
					.andWhere('statement_categories.type = :type', { type: 'income' })
					.getMany(),
			});
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Returns expense default categories', async () => {
			const { repo } = setup();

			const req = {} as Request;
			const res = buildResponse();
			await StatementCategoryController.get.default.expense(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				categories: await repo
					.createQueryBuilder('statement_categories')
					.where('statement_categories.userId IS NULL')
					.andWhere('statement_categories.type = :type', { type: 'expense' })
					.getMany(),
			});
			expect(res.json).toHaveBeenCalledTimes(1);
		});
	});

	describe('Get custom categories suite', () => {
		describe('All custom categories suite', () => {
			test("Doesn't return categories on invalid user id", async () => {
				const req = { params: { userId: 'invalid' }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.custom.all(req, res);

				expect(res.status).toHaveBeenCalledWith(401);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			});
			test('Returns categories by user id', async () => {
				const req = { params: { userId: testUser.id }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.custom.all(req, res);

				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({
					categories: [savedIncomeCategory, savedExpenseCategory],
				});
				expect(res.json).toHaveBeenCalledTimes(1);
			});
		});
		describe('Income custom categories suite', () => {
			test("Doesn't return categories on invalid user id", async () => {
				const req = { params: { userId: 'invalid' }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.custom.income(req, res);

				expect(res.status).toHaveBeenCalledWith(401);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			});
			test('Returns categories by user id', async () => {
				const req = { params: { userId: testUser.id }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.custom.income(req, res);

				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({
					categories: [savedIncomeCategory],
				});
				expect(res.json).toHaveBeenCalledTimes(1);
			});
		});
		describe('Expense custom categories suite', () => {
			test("Doesn't return categories on invalid user id", async () => {
				const req = { params: { userId: 'invalid' }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.custom.expense(req, res);

				expect(res.status).toHaveBeenCalledWith(401);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			});
			test('Returns categories by user id', async () => {
				const req = { params: { userId: testUser.id }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.custom.expense(req, res);

				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({
					categories: [savedExpenseCategory],
				});
				expect(res.json).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('Get categories suite', () => {
		describe('All categories suite', () => {
			test("Doesn't return categories on invalid user id", async () => {
				const req = { params: { userId: 'invalid' }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.all(req, res);

				expect(res.status).toHaveBeenCalledWith(401);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			});
			test('Returns categories by user id', async () => {
				const { repo } = setup();

				const req = { params: { userId: testUser.id }, userPayload } as any;
				const res = buildResponse();
				await StatementCategoryController.get.all(req, res);

				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({
					categories: [
						...(await repo
							.createQueryBuilder('statement_categories')
							.where('statement_categories.userId IS NULL')
							.getMany()),
						savedIncomeCategory,
						savedExpenseCategory,
					],
				});
				expect(res.json).toHaveBeenCalledTimes(1);
			});
		});
		describe('All income categories suite', () => {
			test("Doesn't return categories on invalid user id", async () => {
				const req = { params: { userId: 'invalid' }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.income(req, res);

				expect(res.status).toHaveBeenCalledWith(401);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			});
			test('Returns categories by user id', async () => {
				const { repo } = setup();

				const req = { params: { userId: testUser.id }, userPayload } as any;
				const res = buildResponse();
				await StatementCategoryController.get.income(req, res);

				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({
					categories: [
						...(await repo
							.createQueryBuilder('statement_categories')
							.where('statement_categories.userId IS NULL')
							.andWhere('statement_categories.type = :type', { type: 'income' })
							.getMany()),
						savedIncomeCategory,
					],
				});
				expect(res.json).toHaveBeenCalledTimes(1);
			});
		});
		describe('All expense categories suite', () => {
			test("Doesn't return categories on invalid user id", async () => {
				const req = { params: { userId: 'invalid' }, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.get.expense(req, res);

				expect(res.status).toHaveBeenCalledWith(401);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'Invalid operation.' });
				expect(res.json).toHaveBeenCalledTimes(1);
			});
			test('Returns categories by user id', async () => {
				const { repo } = setup();

				const req = { params: { userId: testUser.id }, userPayload } as any;
				const res = buildResponse();
				await StatementCategoryController.get.expense(req, res);

				expect(res.status).toHaveBeenCalledWith(200);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({
					categories: [
						...(await repo
							.createQueryBuilder('statement_categories')
							.where('statement_categories.userId IS NULL')
							.andWhere('statement_categories.type = :type', { type: 'expense' })
							.getMany()),
						savedExpenseCategory,
					],
				});
				expect(res.json).toHaveBeenCalledTimes(1);
			});
		});
	});
});
