import { Request, Response } from 'express';
import { StatementCategoryDTO } from '../dto/StatementCategory';
import { User } from '../entity/User';
import { getDefaultStatementCategories, save } from '../service/StatementCategory';
import { findUserById } from '../service/User';

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
	post: async (req: Request<{ userId: string }, {}, StatementCategoryDTO>, res: Response) => {
		try {
			const { userId } = req.params;
			const { name, type } = req.body;
			const { id } = req.userPayload;

			if (id !== userId) {
				return res.status(401).json({ message: 'Invalid operation.' });
			}

			const user = (await findUserById(id)) as User;
			const category = { name, type, user };

			await save(category);
			return res.status(201).json({ message: 'The category is successully created.' });
		} catch (e) {
			return res.status(500).json({ e });
		}
	},
};
