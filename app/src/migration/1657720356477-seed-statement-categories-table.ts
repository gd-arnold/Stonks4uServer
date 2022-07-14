import { MigrationInterface, QueryRunner } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { StatementCategory } from '../entity/StatementCategory';

const StatementCategoriesData: Partial<StatementCategory>[] = [
	{ name: 'Auto & Transport', type: 'expense', user: undefined },
	{ name: 'Bills & Utilities', type: 'expense', user: undefined },
	{ name: 'Business Services', type: 'expense', user: undefined },
	{ name: 'Cash & ATM', type: 'expense', user: undefined },
	{ name: 'Check', type: 'expense', user: undefined },
	{ name: 'Clothing', type: 'expense', user: undefined },
	{ name: 'Credit card payment', type: 'expense', user: undefined },
	{ name: 'Eating out', type: 'expense', user: undefined },
	{ name: 'Education', type: 'expense', user: undefined },
	{ name: 'Electronics & Software', type: 'expense', user: undefined },
	{ name: 'Entertainment', type: 'expense', user: undefined },
	{ name: 'Fees', type: 'expense', user: undefined },
	{ name: 'Gifts & Donations', type: 'expense', user: undefined },
	{ name: 'Groceries', type: 'expense', user: undefined },
	{ name: 'Health & Medical', type: 'expense', user: undefined },
	{ name: 'Home', type: 'expense', user: undefined },
	{ name: 'Insurance', type: 'expense', user: undefined },
	{ name: 'Investment', type: 'expense', user: undefined },
	{ name: 'Kids', type: 'expense', user: undefined },
	{ name: 'Loans', type: 'expense', user: undefined },
	{ name: 'Mortgage & Rent', type: 'expense', user: undefined },
	{ name: 'Personal Care', type: 'expense', user: undefined },
	{ name: 'Pets', type: 'expense', user: undefined },
	{ name: 'Savings', type: 'expense', user: undefined },
	{ name: 'Shopping', type: 'expense', user: undefined },
	{ name: 'Sports & Fitness', type: 'expense', user: undefined },
	{ name: 'Taxes', type: 'expense', user: undefined },
	{ name: 'Transfer', type: 'expense', user: undefined },
	{ name: 'Travel', type: 'expense', user: undefined },
	{ name: 'Salary', type: 'income', user: undefined },
	{ name: 'Investment', type: 'income', user: undefined },
	{ name: 'Gifts', type: 'income', user: undefined },
	{ name: 'Government Payments', type: 'income', user: undefined },
	{ name: 'Wages', type: 'income', user: undefined },
	{ name: 'Commisions', type: 'income', user: undefined },
];

export class seedStatementCategoriesTable1657720356477 implements MigrationInterface {
	name = 'seedStatementCategoriesTable1657720356477';

	public async up(queryRunner: QueryRunner): Promise<void> {
		const StatementCategoryRepository = AppDataSource.getRepository(StatementCategory);

		StatementCategoriesData.forEach(async (category) => {
			await StatementCategoryRepository.save(category);
		});
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
