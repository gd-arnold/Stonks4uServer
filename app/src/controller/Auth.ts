import { Request, Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '../dto/Auth';
import { ErrorHandler } from '../helpers/ErrorHandler';
import { AuthService, ITokenPayload } from '../service/Auth';
import { UserService } from '../service/User';

export const AuthController = {
	register: async (req: Request<{}, {}, RegisterUserDTO>, res: Response) => {
		const { email, fullName, password } = req.body;

		try {
			if (await UserService.findUserByEmail(email)) {
				return res.status(409).json({ message: 'User already exists.' });
			}

			const passwordHash = await AuthService.hashPassword(password);
			const user = await UserService.save({ email, passwordHash, fullName });

			const payload: ITokenPayload = { id: user.id, email: user.email };
			const token = AuthService.generateToken(payload);

			return res.status(200).json({
				...payload,
				token,
			});
		} catch (e) {
			return ErrorHandler.controller(res, e);
		}
	},

	login: async (req: Request<{}, {}, LoginUserDTO>, res: Response) => {
		const { email, password } = req.body;

		try {
			const user = await UserService.findUserByEmail(email);
			if (user === null) {
				return res.status(401).json({ message: "User doesn't exist." });
			}

			if (!(await AuthService.isPasswordValid(password, user))) {
				return res.status(401).json({ message: 'Invalid password.' });
			}

			const payload: ITokenPayload = { id: user.id, email: user.email };
			const token = AuthService.generateToken(payload);

			return res.status(200).json({
				...payload,
				token,
			});
		} catch (e) {
			return ErrorHandler.controller(res, e);
		}
	},
};
