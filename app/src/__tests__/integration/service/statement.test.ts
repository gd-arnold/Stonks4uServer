import { AppDataSource } from '../../../config/data-source';
import Database from '../../../db';
import { Statement } from '../../../entity/Statement';
import { StatementCategory } from '../../../entity/StatementCategory';
import { StatementRecurrenceType } from '../../../entity/StatementRecurrenceType';
import { User } from '../../../entity/User';
import { StatementService } from '../../../service/Statement';
import { StatementRecurrenceTypeService } from '../../../service/StatementRecurrenceType';
import { TestDBContainer } from '../../utils/dbcontainer.utils';
import { createSavedStatementCategory } from '../../utils/statement-category';
import { createStatement } from '../../utils/statement.utils';
import { createSavedUser } from '../../utils/user.utils';

describe('Statement service suite', () => {
	jest.setTimeout(180000);

	const dbContainer = new TestDBContainer();
	let testUser: User = {} as User;
	let incomeCategory: StatementCategory = {} as StatementCategory;
	let expenseCategory: StatementCategory = {} as StatementCategory;
	let recurrenceType: StatementRecurrenceType = {} as StatementRecurrenceType;

	let savedIncomeStatement: Statement;
	let savedExpenseStatement: Statement;

	beforeAll(async () => {
		await dbContainer.start();
		await Database.connect();

		testUser = await createSavedUser({ balance: 100 });
		incomeCategory = (await createSavedStatementCategory(testUser, {
			type: 'income',
		})) as StatementCategory;
		expenseCategory = (await createSavedStatementCategory(testUser, {
			type: 'expense',
		})) as StatementCategory;
		recurrenceType = (await StatementRecurrenceTypeService.getRecurrenceTypeByAlias(
			'weekly'
		)) as StatementRecurrenceType;
	});

	afterAll(async () => {
		await Database.disconnect();
		await dbContainer.stop();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(Statement);

		const testIncomeStatement = createStatement(testUser, incomeCategory, recurrenceType, {
			name: 'TestI',
		});
		const testExpenseStatement = createStatement(testUser, expenseCategory, recurrenceType, {
			name: 'TestE',
		});

		return { repo, testIncomeStatement, testExpenseStatement };
	};

	test('Saves statement in database', async () => {
		const { repo, testIncomeStatement, testExpenseStatement } = setup();

		for (const statement of [testIncomeStatement, testExpenseStatement]) {
			await StatementService.save(statement);

			const savedStatement = (await repo
				.createQueryBuilder('statements')
				.leftJoinAndSelect('statements.user', 'users')
				.leftJoinAndSelect('statements.category', 'statement_categories')
				.leftJoinAndSelect('statements.recurrenceType', 'statement_recurrence_types')
				.where('statements.id = :id', { id: statement.id })
				.getOne()) as Partial<Statement>;

			savedStatement.amount = Number(savedStatement.amount);
			savedStatement.user!.balance = Number(savedStatement.user!.balance);

			(Object.keys(statement) as Array<keyof typeof statement>).forEach((key) => {
				expect(savedStatement[key]).toEqual(statement[key]);
			});

			delete savedStatement.user;
			delete savedStatement.category;
			delete savedStatement.recurrenceType;

			if (statement.type === 'income') {
				savedIncomeStatement = statement;
			} else {
				savedExpenseStatement = statement;
			}
		}
	});
});
