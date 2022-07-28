import { Request, Response } from 'express';
import { StatementDTO } from '../dto/Statement';
import { Statement } from '../entity/Statement';
import { User } from '../entity/User';
import { StatementService } from '../service/Statement';
import { StatementCategoryService } from '../service/StatementCategory';
import { StatementRecurrenceTypeService } from '../service/StatementRecurrenceType';
import { UserService } from '../service/User';

export const StatementController = {
	post: async (req: Request<{}, {}, StatementDTO>, res: Response) => {
		try {
			const { name, type, categoryId, amount, recurrenceTypeAlias, automaticPayment } = req.body;
			const date = new Date(req.body.date);

			const { id } = req.userPayload;

			const category = await StatementCategoryService.getCategory(categoryId, id);
			if (category === null) {
				return res.status(401).json({ message: 'Invalid category.' });
			}

			const recurrenceType = await StatementRecurrenceTypeService.getRecurrenceTypeByAlias(
				recurrenceTypeAlias
			);
			if (recurrenceType === null) {
				return res.status(404).json({ message: 'Invalid recurring type alias.' });
			}

			const user = (await UserService.findUserById(id)) as User;
			const recurrenceRule =
				StatementRecurrenceTypeService.RTypeToRRuleMap[
					recurrenceTypeAlias as keyof typeof StatementRecurrenceTypeService.RTypeToRRuleMap
				](date).toString();

			const statement: Partial<Statement> = {
				name,
				user,
				type,
				category,
				recurrenceType,
				recurrenceRule,
				amount,
				date,
				automaticPayment,
			};

			await StatementService.save(statement);
			return res.status(201).json({ message: 'The statement is successully created.' });
		} catch (e) {
			return res.status(500).json({ e });
		}
	},
};
