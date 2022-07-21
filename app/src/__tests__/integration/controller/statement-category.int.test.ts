import Database from '../../../db';
import { Request } from 'express';
import { TestDBContainer } from '../../utils/dbcontainer.utils';
import { buildResponse } from '../../utils/express.utils';
import { StatementCategoryController } from '../../../controller/StatementCategory';
import { AppDataSource } from '../../../config/data-source';
import { StatementCategory } from '../../../entity/StatementCategory';

describe('Statement category controller suite', () => {
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

	const repo = AppDataSource.getRepository(StatementCategory);

	describe('Get default categories test suite', () => {
		test('Returns all default categories', async () => {
			const req = {} as Request;
			const res = buildResponse();
			await StatementCategoryController.get.default.all(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				categories: await repo.find({ where: { user: undefined } }),
			});
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Returns income default categories', async () => {
			const req = {} as Request;
			const res = buildResponse();
			await StatementCategoryController.get.default.income(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				categories: await repo.find({ where: { user: undefined, type: 'income' } }),
			});
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Returns expense default categories', async () => {
			const req = {} as Request;
			const res = buildResponse();
			await StatementCategoryController.get.default.expense(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({
				categories: await repo.find({ where: { user: undefined, type: 'expense' } }),
			});
			expect(res.json).toHaveBeenCalledTimes(1);
		});
	});
});
