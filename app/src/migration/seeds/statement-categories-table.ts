import { MigrationInterface, QueryRunner } from 'typeorm';
import { StatementCategory } from '../../entity/StatementCategory';

const categories: Partial<StatementCategory>[] = [
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

export class statementCategoriesTable implements MigrationInterface {
	name = 'statementCategoriesTable9999999999999';

	async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.insert(StatementCategory, categories);
	}

	async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DELETE FROM statement_categories');
	}
}
