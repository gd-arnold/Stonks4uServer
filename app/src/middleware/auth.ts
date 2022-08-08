import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/Auth';
import { UserService } from '../service/User';

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization;

		if (!authorizationHeader) {
			return res.status(401).json({ message: 'No auth token found. Authorization denied.' });
		}

		const token = authorizationHeader.replace(/^Bearer\s/, '');

		try {
			const userPayload = AuthService.verifyToken(token) as IUserPayload;
			const user = await UserService.findUserById(userPayload.id);

			if (user === null) {
				return res.status(401).json({ message: 'Invalid operation.' });
			}

			req.userPayload = userPayload;
			next();
		} catch (e: any) {
			return res.status(401).json({ message: 'Token verification failed.' });
		}
	} catch (e: any) {
		return res.status(500).json({ e });
	}
};
