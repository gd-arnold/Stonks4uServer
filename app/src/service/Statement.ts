import { AppDataSource } from '../config/data-source';
import { ProcessedStatement } from '../entity/ProcessedStatement';
import { Statement, StatementTypeType } from '../entity/Statement';
import { StatementRecurrenceType } from '../entity/StatementRecurrenceType';
import { User } from '../entity/User';
import { CustomError } from '../helpers/CustomError';
import { ProcessedStatementService } from './ProcessedStatement';
import { StatementRecurrenceTypeService } from './StatementRecurrenceType';
import { UserService } from './User';

const StatementRepository = AppDataSource.getRepository(Statement);

export const StatementService = {
	getStatement: async (id: string, userId?: string) => {
		let statementQuery = StatementRepository.createQueryBuilder('statements').where(
			'statements.id = :id',
			{ id }
		);

		if (typeof userId !== 'undefined') {
			statementQuery = statementQuery.andWhere('statements.userId = :userId', { userId });
		}

		const statement = await statementQuery.getOne();
		return statement;
	},
	getStatements: async (userId: string, type?: StatementTypeType) => {
		let statementsQuery = StatementRepository.createQueryBuilder('statements')
			.leftJoinAndSelect('statements.category', 'category')
			.leftJoinAndSelect('statements.recurrenceType', 'recurrenceType')
			.leftJoinAndSelect('statements.processes', 'processedStatements')
			.where('statements.userId = :userId', { userId });

		if (typeof type !== 'undefined') {
			statementsQuery = statementsQuery.andWhere('statements.type = :type', { type });
		}

		const statements = await statementsQuery.getMany();
		return statements;
	},
	process: async function (statement: Statement, user: User) {
		const StatementBalanceMap = {
			income: (balance: number, amount: number) => balance + amount,
			expense: (balance: number, amount: number) => balance - amount,
		};

		if (statement.isProcessed) {
			throw new CustomError(400, 'The statement is already processed.');
		}

		user.balance = StatementBalanceMap[statement.type](
			Number(user.balance),
			Number(statement.amount)
		);
		if (user.balance < 0) {
			throw new CustomError(400, 'Not enough money in balance.');
		}

		await UserService.save(user);

		const recurrenceType = (await StatementRecurrenceTypeService.getRecurrenceTypeByStatementId(
			statement.id
		)) as StatementRecurrenceType;

		if (statement.required_process === 0 || recurrenceType.alias === 'once') {
			statement.isProcessed = true;
		}
		statement.required_process = Math.max(statement.required_process - 1, 0);

		await this.save(statement);

		if (recurrenceType.alias === 'once') {
			await this.softDelete(statement.id);
		}

		const processedStatement: Partial<ProcessedStatement> = {
			statement: statement,
			amount: statement.amount,
		};

		await ProcessedStatementService.save(processedStatement);

		return true;
	},
	save: async (input: Partial<Statement>) => {
		const statement = StatementRepository.create(input);
		await StatementRepository.save(statement);

		return true;
	},
	softDelete: async (statementId: string) => {
		await StatementRepository.softDelete(statementId);

		return true;
	},
};
