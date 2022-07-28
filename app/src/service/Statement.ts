import { AppDataSource } from '../config/data-source';
import { Statement } from '../entity/Statement';

const StatementRepository = AppDataSource.getRepository(Statement);

export const StatementService = {
	getStatementById: async (id: string) => {
		const statement = await StatementRepository.findOneBy({ id });
		return statement;
	},
	save: async (input: Partial<Statement>) => {
		const statement = StatementRepository.create(input);
		await StatementRepository.save(statement);

		return true;
	},
};
