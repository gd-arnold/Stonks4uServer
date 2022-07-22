import { AppDataSource } from '../config/data-source';
import { StatementCategory, StatementCategoryTypeType } from '../entity/StatementCategory';

const StatementCategoryRepository = AppDataSource.getRepository(StatementCategory);

export const getDefaultStatementCategories = async (type?: StatementCategoryTypeType) => {
	let defaultCategoriesQuery = StatementCategoryRepository.createQueryBuilder(
		'statement_categories'
	).where('statement_categories.userId IS NULL');

	if (typeof type !== 'undefined') {
		defaultCategoriesQuery = defaultCategoriesQuery.andWhere('statement_categories.type = :type', {
			type,
		});
	}

	const defaultCategories = await defaultCategoriesQuery.getMany();
	return defaultCategories;
};

export const save = async (input: Partial<StatementCategory>) => {
	const category = StatementCategoryRepository.create(input);
	await StatementCategoryRepository.save(category);

	return true;
};
