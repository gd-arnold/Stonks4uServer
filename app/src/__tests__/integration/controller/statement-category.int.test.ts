import Database from '../../../db';
import { Request } from 'express';
import { TestDBContainer } from '../../utils/dbcontainer.utils';
import { buildResponse } from '../../utils/express.utils';
import { StatementCategoryController } from '../../../controller/StatementCategory';
import { AppDataSource } from '../../../config/data-source';
import { StatementCategory } from '../../../entity/StatementCategory';
import { User } from '../../../entity/User';
import { generateUser } from '../../utils/user.utils';
import { StatementCategoryDTO } from '../../../dto/StatementCategory';

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
		testUser = await generateUser();
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

		return { repo };
	};

	describe('Create custom category suite', () => {
		let testIncomeCategoryDTO: StatementCategoryDTO = {
			name: 'TestI',
			type: 'income',
		};
		let testExpenseCategoryDTO: StatementCategoryDTO = {
			name: 'TestE',
			type: 'expense',
		};

		test("Doesn't create category on invalid user id", async () => {
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
			const { repo } = setup();

			[testIncomeCategoryDTO, testExpenseCategoryDTO].forEach(async (category) => {
				const req = { params: { userId: testUser.id }, body: category, userPayload } as any;
				const res = buildResponse();

				await StatementCategoryController.post(req, res);

				expect(res.status).toHaveBeenCalledWith(201);
				expect(res.status).toHaveBeenCalledTimes(1);
				expect(res.json).toHaveBeenCalledWith({ message: 'The category is successully created.' });
				expect(res.json).toHaveBeenCalledTimes(1);

				savedIncomeCategory = repo.create(testIncomeCategoryDTO);
				savedExpenseCategory = repo.create(testExpenseCategoryDTO);
			});
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
});
