import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../entity/User';
import { JWT } from '../config/config';

export interface ITokenPayload {
	id: number;
	email: string;
}

export const generateToken = (payload: ITokenPayload) => {
	const token = jwt.sign(payload, JWT.key);

	return token;
};

export const verifyToken = (token: string) => {
	const decodedToken = jwt.verify(token, JWT.key);

	return decodedToken;
};

export const hashPassword = async (password: string, saltRounds: number = 10) => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(password, salt);

	return hash;
};

export const isPasswordValid = async (password: string, user: User) => {
	return await bcrypt.compare(password, user.passwordHash);
};
