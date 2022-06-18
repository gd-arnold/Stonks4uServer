import { Request, Response } from 'express';
import { RegisterUserDTO } from '../dto/user';
import { hashPassword, save, userExists } from '../service/user';

export const createUser = async (req: Request<{}, {}, RegisterUserDTO>, res: Response) => {
	const { email, fullName, password } = req.body;

	try {
		if (await userExists(email)) {
			return res.status(409).json({ message: 'User already exists.' });
		}

		const passwordHash = await hashPassword(password);
		await save({ email, passwordHash, fullName });

		res.status(201).json({ message: 'User is successfully created.' });
	} catch (e) {
		res.send(500).send({ e });
	}
};
