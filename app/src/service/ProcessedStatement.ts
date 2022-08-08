import { AppDataSource } from '../config/data-source';
import { ProcessedStatement } from '../entity/ProcessedStatement';

const ProcessedStatementRepository = AppDataSource.getRepository(ProcessedStatement);

export const ProcessedStatementService = {
	save: async (input: Partial<ProcessedStatement>) => {
		const processedStatement = ProcessedStatementRepository.create(input);
		await ProcessedStatementRepository.save(processedStatement);

		return true;
	},
};
