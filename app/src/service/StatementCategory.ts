import { AppDataSource } from '../config/data-source';
import { StatementCategory, StatementCategoryTypeType } from '../entity/StatementCategory';

const StatementCategoryRepository = AppDataSource.getRepository(StatementCategory);

interface IDefaultCategoriesConditions {
	user: undefined;
	type?: StatementCategoryTypeType;
}

export const getDefaultStatementCategories = async (type?: StatementCategoryTypeType) => {
	let conditions: IDefaultCategoriesConditions = {
		user: undefined,
	};

	if (typeof type !== 'undefined') {
		conditions.type = type;
	}

	const defaultCategories = await StatementCategoryRepository.find({ where: conditions });

	return defaultCategories;
};
