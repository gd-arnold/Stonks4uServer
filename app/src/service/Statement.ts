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
	getRecurrenceTypeByStatementId: async (id: string) => {
		const statemnet = await StatementRepository.createQueryBuilder('statements')
			.leftJoinAndSelect('statements.recurrenceType', 'recurrenceType')
			.where('statements.id = :id', { id })
			.getOne();

		if (statemnet !== null) {
			return statemnet.recurrenceType;
		}

		return null;
	},
	getUserByStatementId: async (id: string) => {
		const statement = await StatementRepository.createQueryBuilder('statements')
			.leftJoinAndSelect('statements.user', 'user')
			.where('statements.id = :id', { id })
			.getOne();

		if (statement !== null) {
			return statement.user;
		}

		return null;
	},
	updateUserBalance: async function (statement: Statement, user?: User) {
		const StatementBalanceMap = {
			income: (balance: number, amount: number) => balance + amount,
			expense: (balance: number, amount: number) => balance - amount,
		};

		if (typeof user === 'undefined') {
			user = (await this.getUserByStatementId(statement.id)) as User;
		}

		if (user.balance === null) {
			throw new CustomError(400, 'Invalid user balance.');
		}

		user.balance = StatementBalanceMap[statement.type](
			Number(user.balance),
			Number(statement.amount)
		);

		if (user.balance < 0) {
			throw new CustomError(400, 'Not enough money in balance.');
		}

		await UserService.save(user);
	},
	updateProcessedStatement: async function (statement: Statement) {
		const recurrenceType = (await this.getRecurrenceTypeByStatementId(
			statement.id
		)) as StatementRecurrenceType;

		if (statement.required_processes === 0 || recurrenceType.alias === 'once') {
			statement.isProcessed = true;
		}
		statement.required_processes = Math.max(statement.required_processes - 1, 0);

		await this.save(statement);

		if (recurrenceType.alias === 'once') {
			await this.softDelete(statement.id);
			statement.deletedAt = new Date();
		}

		return true;
	},
	process: async function (statement: Statement, user: User) {
		if (statement.isProcessed) {
			throw new CustomError(400, 'The statement is already processed.');
		}

		await this.updateUserBalance(statement, user);
		await this.updateProcessedStatement(statement);
		await ProcessedStatementService.save({ statement: statement, amount: statement.amount });

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
