import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { StatementCategory } from '../../../entity/StatementCategory';
import { getDefaultStatementCategories } from '../../../service/StatementCategory';
import { TestDBContainer } from '../../utils/dbcontainer.utils';

describe('Statement category service suite', () => {
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

	test('Gets default statement categories', async () => {
		expect(await getDefaultStatementCategories()).toEqual(
			await repo.find({ where: { user: undefined } })
		);
		expect(await getDefaultStatementCategories('income')).toEqual(
			await repo.find({ where: { user: undefined, type: 'income' } })
		);
		expect(await getDefaultStatementCategories('expense')).toEqual(
			await repo.find({ where: { user: undefined, type: 'expense' } })
		);
	});
});
