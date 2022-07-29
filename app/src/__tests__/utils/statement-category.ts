import { AppDataSource } from '../../config/data-source';
import { StatementCategory } from '../../entity/StatementCategory';
import { User } from '../../entity/User';

const repo = AppDataSource.getRepository(StatementCategory);

export const createStatementCategory = (user: User, overrides: Partial<StatementCategory> = {}) => {
	return repo.create({
		name: 'Test',
		type: 'income',
		user,
		...overrides,
	});
};

export const createSavedStatementCategory = async (
	user: User,
	overrides: Partial<StatementCategory> = {}
) => {
	const category = createStatementCategory(user, overrides);
	await repo.save(category);

	return category;
};
