import { AppDataSource } from '../config/data-source';
import { Statement, StatementTypeType } from '../entity/Statement';

const StatementRepository = AppDataSource.getRepository(Statement);

export const StatementService = {
	getStatementById: async (id: string) => {
		const statement = await StatementRepository.findOneBy({ id });
		return statement;
	},
	getStatements: async (userId: string, type?: StatementTypeType) => {
		let statementsQuery = await StatementRepository.createQueryBuilder('statements')
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
	save: async (input: Partial<Statement>) => {
		const statement = StatementRepository.create(input);
		await StatementRepository.save(statement);

		return true;
	},
};
