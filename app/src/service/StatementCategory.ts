import { AppDataSource } from '../config/data-source';
import { StatementCategory, StatementCategoryTypeType } from '../entity/StatementCategory';

const StatementCategoryRepository = AppDataSource.getRepository(StatementCategory);

export const StatementCategoryService = {
	getDefaultCategories: async (type?: StatementCategoryTypeType) => {
		let defaultCategoriesQuery = StatementCategoryRepository.createQueryBuilder(
			'statement_categories'
		).where('statement_categories.userId IS NULL');

		if (typeof type !== 'undefined') {
			defaultCategoriesQuery = defaultCategoriesQuery.andWhere(
				'statement_categories.type = :type',
				{ type }
			);
		}

		const defaultCategories = await defaultCategoriesQuery.getMany();
		return defaultCategories;
	},
	getCustomCategories: async (userId: string, type?: StatementCategoryTypeType) => {
		let customCategoriesQuery = StatementCategoryRepository.createQueryBuilder(
			'statement_categories'
		).where('statement_categories.userId = :userId', { userId });

		if (typeof type !== 'undefined') {
			customCategoriesQuery = customCategoriesQuery.andWhere('statement_categories.type = :type', {
				type,
			});
		}

		const customCategories = await customCategoriesQuery.getMany();
		return customCategories;
	},
	save: async (input: Partial<StatementCategory>) => {
		const category = StatementCategoryRepository.create(input);
		await StatementCategoryRepository.save(category);

		return true;
	},
};
