import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { JWT } from '../config/config';

export interface ITokenPayload {
	id: string;
	email: string;
}

export const AuthService = {
	generateToken: (payload: ITokenPayload) => {
		const token = jwt.sign(payload, JWT.key);

		return token;
	},
	verifyToken: (token: string) => {
		const decodedToken = jwt.verify(token, JWT.key);

		return decodedToken;
	},
	hashPassword: async (password: string, saltRounds: number = 10) => {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, salt);

		return hash;
	},
	isPasswordValid: async (password: string, user: User) => {
		return await bcrypt.compare(password, user.passwordHash);
	},
};
