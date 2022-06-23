import { Request, Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth';
import { generateToken, hashPassword, isPasswordValid, ITokenPayload } from '../service/auth';
import { findUserByEmail, save } from '../service/user';

export const register = async (req: Request<{}, {}, RegisterUserDTO>, res: Response) => {
	const { email, fullName, password } = req.body;

	try {
		if (await findUserByEmail(email)) {
			return res.status(409).json({ message: 'User already exists.' });
		}

		const passwordHash = await hashPassword(password);
		const user = await save({ email, passwordHash, fullName });

		const payload: ITokenPayload = { id: user.id, email: user.email };
		const token = generateToken(payload);

		return res.status(200).json({
			...payload,
			token,
		});
	} catch (e) {
		res.status(500).json({ e });
	}
};

export const login = async (req: Request<{}, {}, LoginUserDTO>, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await findUserByEmail(email);
		if (user === null) {
			return res.status(401).json({ message: "User doesn't exist." });
		}

		if (!(await isPasswordValid(password, user))) {
			return res.status(401).json({ message: 'Invalid password.' });
		}

		const payload: ITokenPayload = { id: user.id, email: user.email };
		const token = generateToken(payload);

		return res.status(200).json({
			...payload,
			token,
		});
	} catch (e) {
		res.status(500).json({ e });
	}
};
