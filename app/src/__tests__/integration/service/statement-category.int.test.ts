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
