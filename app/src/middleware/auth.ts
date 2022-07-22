import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../service/Auth';
export const auth = (req: Request, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization;

		if (!authorizationHeader) {
			return res.status(401).json({ message: 'No auth token found. Authorization denied.' });
		}

		const token = authorizationHeader.replace(/^Bearer\s/, '');

		try {
			req.userPayload = AuthService.verifyToken(token) as IUserPayload;
			next();
		} catch (e: any) {
			res.status(401).json({ message: 'Token verification failed.' });
		}
	} catch (e: any) {
		res.status(500).json({ e });
	}
};
