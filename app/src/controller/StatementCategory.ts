import { Request, Response } from 'express';
import { getDefaultStatementCategories } from '../service/StatementCategory';

export const StatementCategoryController = {
	get: {
		all: () => {},
		income: () => {},
		expense: () => {},
		default: {
			all: async (req: Request, res: Response) => {
				try {
					const categories = await getDefaultStatementCategories();

					return res.status(200).json({
						categories,
					});
				} catch (e) {
					return res.status(500).json({ e });
				}
			},
			income: async (req: Request, res: Response) => {
				try {
					const categories = await getDefaultStatementCategories('income');

					return res.status(200).json({
						categories,
					});
				} catch (e) {
					return res.status(500).json({ e });
				}
			},
			expense: async (req: Request, res: Response) => {
				try {
					const categories = await getDefaultStatementCategories('expense');

					return res.status(200).json({
						categories,
					});
				} catch (e) {
					return res.status(500).json({ e });
				}
			},
		},
		custom: {
			all: () => {},
			income: () => {},
			expense: () => {},
		},
	},
};
