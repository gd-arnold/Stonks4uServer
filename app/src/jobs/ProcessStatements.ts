import { RRule } from 'rrule';
import { AppDataSource } from '../config/data-source';
import { ProcessedStatement } from '../entity/ProcessedStatement';
import { Statement } from '../entity/Statement';
import { StatementRecurrenceType } from '../entity/StatementRecurrenceType';
import { User } from '../entity/User';
import { CustomError } from '../helpers/CustomError';
import { ProcessedStatementService } from '../service/ProcessedStatement';
import { StatementService } from '../service/Statement';
import { UserService } from '../service/User';

const StatementRepository = AppDataSource.getRepository(Statement);

const TimeInterval = (function () {
	const end = new Date();
	end.setMinutes(end.getMinutes() + 30);

	const start = new Date(end.getTime());
	start.setHours(start.getHours() - 1);

	return { start, end };
})();

const process = async (statement: Statement) => {
	try {
		if (!statement.isProcessed && statement.automaticPayment) {
			await StatementService.updateUserBalance(statement);
			await StatementService.updateProcessedStatement(statement);
			await ProcessedStatementService.save({ statement: statement, amount: statement.amount });
		}
		if (!statement.isProcessed) {
			statement.required_processes++;
		}
		statement.isProcessed = false;

		if (statement.deletedAt === null) {
			await StatementService.save(statement);
		}
		return true;
	} catch (e: any) {
		if (e instanceof CustomError) {
			statement.required_processes++;
			await StatementService.save(statement);
		} else {
			console.error(e.message);
		}
	}
};

export const ProcessStatements = async () => {
	const statements = await StatementRepository.find();

	for (const statement of statements) {
		const recurrenceRule = RRule.fromString(statement.recurrenceRule);
		const recurrences = recurrenceRule.between(TimeInterval.start, TimeInterval.end, true);

		if (recurrences.length > 0) {
			await process(statement);
		}
	}

	return true;
};
