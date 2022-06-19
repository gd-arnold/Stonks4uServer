import { Request, Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '../dto/user';
import {
	findUserByEmail,
	generateToken,
	hashPassword,
	isPasswordValid,
	save,
} from '../service/user';

export const createUser = async (req: Request<{}, {}, RegisterUserDTO>, res: Response) => {
	const { email, fullName, password } = req.body;

	try {
		if (await findUserByEmail(email)) {
			return res.status(409).json({ message: 'User already exists.' });
		}

		const passwordHash = await hashPassword(password);
		const user = await save({ email, passwordHash, fullName });

		const userPayload = { id: user.id, email: user.email };
		const token = generateToken(userPayload);

		return res.status(200).json({
			...userPayload,
			token,
		});
	} catch (e) {
		res.send(500).send({ e });
	}
};

export const loginUser = async (req: Request<{}, {}, LoginUserDTO>, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await findUserByEmail(email);
		if (user === null) {
			return res.status(401).json({ message: "User doesn't exist." });
		}

		if (!(await isPasswordValid(password, user))) {
			return res.status(401).json({ message: 'Invalid password.' });
		}

		const userPayload = { id: user.id, email: user.email };
		const token = generateToken(userPayload);

		return res.status(200).json({
			...userPayload,
			token,
		});
	} catch (e) {
		res.send(500).send({ e });
	}
};
