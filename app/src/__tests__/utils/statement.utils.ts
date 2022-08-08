import { randomUUID } from 'crypto';
import { AppDataSource } from '../../config/data-source';
import { Statement } from '../../entity/Statement';
import { StatementCategory } from '../../entity/StatementCategory';
import { StatementRecurrenceType } from '../../entity/StatementRecurrenceType';
import { User } from '../../entity/User';
import { StatementRecurrenceTypeService } from '../../service/StatementRecurrenceType';

const repo = AppDataSource.getRepository(Statement);

export const createStatement = (
	user: User,
	category: StatementCategory,
	recurrenceType: StatementRecurrenceType,
	overrides: Partial<Statement> = {}
) => {
	const date = new Date();

	return repo.create({
		id: randomUUID(),
		name: 'Test',
		type: category.type,
		user,
		category,
		amount: 10.0,
		date,
		recurrenceType,
		recurrenceRule:
			StatementRecurrenceTypeService.RTypeToRRuleMap[
				recurrenceType.alias as keyof typeof StatementRecurrenceTypeService.RTypeToRRuleMap
			](date).toString(),
		automaticPayment: false,
		...overrides,
	});
};

export const createSavedStament = async (
	user: User,
	category: StatementCategory,
	recurrenceType: StatementRecurrenceType,
	overrides: Partial<Statement> = {}
) => {
	const statement: Partial<Statement> = createStatement(user, category, recurrenceType, overrides);
	await repo.save(statement);

	delete statement.user;
	delete statement.category;
	delete statement.recurrenceType;

	return statement;
};
