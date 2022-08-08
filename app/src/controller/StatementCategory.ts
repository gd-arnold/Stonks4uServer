import { isUUID } from 'class-validator';
import { Request, Response } from 'express';
import { StatementCategoryDTO } from '../dto/StatementCategory';
import { User } from '../entity/User';
import { ErrorHandler } from '../helpers/ErrorHandler';
import { StatementCategoryService } from '../service/StatementCategory';
import { UserService } from '../service/User';

export const StatementCategoryController = {
	get: {
		all: async (req: Request, res: Response) => {
			try {
				const { userId } = req.params;
				const { id } = req.userPayload;

				if (id !== userId) {
					return res.status(401).json({ message: 'Invalid operation.' });
				}

				const categories = await StatementCategoryService.getCategories(id);
				return res.status(200).json({ categories });
			} catch (e) {
				return ErrorHandler.controller(res, e);
			}
		},
		income: async (req: Request, res: Response) => {
			try {
				const { userId } = req.params;
				const { id } = req.userPayload;

				if (id !== userId) {
					return res.status(401).json({ message: 'Invalid operation.' });
				}

				const categories = await StatementCategoryService.getCategories(id, 'income');
				return res.status(200).json({ categories });
			} catch (e) {
				return ErrorHandler.controller(res, e);
			}
		},
		expense: async (req: Request, res: Response) => {
			try {
				const { userId } = req.params;
				const { id } = req.userPayload;

				if (id !== userId) {
					return res.status(401).json({ message: 'Invalid operation.' });
				}

				const categories = await StatementCategoryService.getCategories(id, 'expense');
				return res.status(200).json({ categories });
			} catch (e) {
				return ErrorHandler.controller(res, e);
			}
		},
		default: {
			all: async (req: Request, res: Response) => {
				try {
					const categories = await StatementCategoryService.getDefaultCategories();

					return res.status(200).json({ categories });
				} catch (e) {
					return ErrorHandler.controller(res, e);
				}
			},
			income: async (req: Request, res: Response) => {
				try {
					const categories = await StatementCategoryService.getDefaultCategories('income');

					return res.status(200).json({ categories });
				} catch (e) {
					return ErrorHandler.controller(res, e);
				}
			},
			expense: async (req: Request, res: Response) => {
				try {
					const categories = await StatementCategoryService.getDefaultCategories('expense');

					return res.status(200).json({ categories });
				} catch (e) {
					return ErrorHandler.controller(res, e);
				}
			},
		},
		custom: {
			all: async (req: Request, res: Response) => {
				try {
					const { userId } = req.params;
					const { id } = req.userPayload;

					if (id !== userId) {
						return res.status(401).json({ message: 'Invalid operation.' });
					}

					const categories = await StatementCategoryService.getCustomCategories(id);
					return res.status(200).json({ categories });
				} catch (e) {
					return ErrorHandler.controller(res, e);
				}
			},
			income: async (req: Request, res: Response) => {
				try {
					const { userId } = req.params;
					const { id } = req.userPayload;

					if (id !== userId) {
						return res.status(401).json({ message: 'Invalid operation.' });
					}

					const categories = await StatementCategoryService.getCustomCategories(id, 'income');
					return res.status(200).json({ categories });
				} catch (e) {
					return ErrorHandler.controller(res, e);
				}
			},
			expense: async (req: Request, res: Response) => {
				try {
					const { userId } = req.params;
					const { id } = req.userPayload;

					if (id !== userId) {
						return res.status(401).json({ message: 'Invalid operation.' });
					}

					const categories = await StatementCategoryService.getCustomCategories(id, 'expense');
					return res.status(200).json({ categories });
				} catch (e) {
					return ErrorHandler.controller(res, e);
				}
			},
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

			const user = (await UserService.findUserById(id)) as User;
			const category = { name, type, user };

			await StatementCategoryService.save(category);
			return res.status(201).json({ message: 'The category is successully created.' });
		} catch (e) {
			return ErrorHandler.controller(res, e);
		}
	},
	put: async (req: Request<{ id: string }, {}, StatementCategoryDTO>, res: Response) => {
		try {
			const categoryId = req.params.id;
			const userId = req.userPayload.id;
			const partial = req.body;

			if (!isUUID(categoryId)) {
				return res.status(400).json({ message: 'Invalid category id' });
			}

			const category = await StatementCategoryService.getCustomCategory(categoryId, userId);

			if (category === null) {
				return res.status(401).json({ message: 'Invalid operation.' });
			}

			await StatementCategoryService.update(categoryId, partial);

			return res.status(204).send();
		} catch (e) {
			return ErrorHandler.controller(res, e);
		}
	},
	delete: async (req: Request, res: Response) => {
		try {
			const categoryId = req.params.id;
			const userId = req.userPayload.id;

			if (!isUUID(categoryId)) {
				return res.status(400).json({ message: 'Invalid category id' });
			}

			const category = await StatementCategoryService.getCustomCategory(categoryId, userId);

			if (category === null) {
				return res.status(401).json({ message: 'Invalid operation.' });
			}

			await StatementCategoryService.softDelete(categoryId);
			return res.status(204).send();
		} catch (e) {
			return ErrorHandler.controller(res, e);
		}
	},
};
