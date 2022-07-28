import { Request, Response } from 'express';
import { UserBalanceDTO } from '../dto/UserBalance';
import { User } from '../entity/User';
import { UserService } from '../service/User';

export const UserController = {
	setBalance: async (req: Request<{}, {}, UserBalanceDTO>, res: Response) => {
		try {
			const { balance } = req.body;
			const { id } = req.userPayload;

			const user = (await UserService.findUserById(id)) as User;
			user.balance = balance;

			await UserService.save(user);
			return res.status(204).send();
		} catch (e) {
			return res.status(500).json({ e });
		}
	},
};
