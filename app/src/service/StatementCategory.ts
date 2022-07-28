import { Brackets } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { StatementCategoryDTO } from '../dto/StatementCategory';
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
	getCategories: async (userId: string, type?: StatementCategoryTypeType) => {
		let customCategoriesQuery = StatementCategoryRepository.createQueryBuilder(
			'statement_categories'
		).where(
			new Brackets((qb) => {
				qb.where('statement_categories.userId = :userId', { userId }).orWhere(
					'statement_categories.userId IS NULL'
				);
			})
		);

		if (typeof type !== 'undefined') {
			customCategoriesQuery = customCategoriesQuery.andWhere('statement_categories.type = :type', {
				type,
			});
		}

		const customCategories = await customCategoriesQuery.getMany();
		return customCategories;
	},
	getCategory: async (categoryId: string, userId: string) => {
		const category = await StatementCategoryRepository.createQueryBuilder('statement_category')
			.where('statement_category.id = :categoryId', { categoryId })
			.andWhere(
				new Brackets((qb) => {
					qb.where('statement_category.userId = :userId', { userId }).orWhere(
						'statement_category.userId IS NULL'
					);
				})
			)
			.getOne();

		return category;
	},
	getCustomCategory: async (categoryId: string, userId: string) => {
		const category = await StatementCategoryRepository.createQueryBuilder('statement_category')
			.where('statement_category.id = :categoryId', { categoryId })
			.andWhere('statement_category.userId = :userId', { userId })
			.getOne();

		return category;
	},
	save: async (input: Partial<StatementCategory>) => {
		const category = StatementCategoryRepository.create(input);
		await StatementCategoryRepository.save(category);

		return true;
	},
	update: async (categoryId: string, partial: StatementCategoryDTO) => {
		await StatementCategoryRepository.update(categoryId, partial);

		return true;
	},
	delete: async (categoryId: string) => {
		await StatementCategoryRepository.delete(categoryId);

		return true;
	},
};
