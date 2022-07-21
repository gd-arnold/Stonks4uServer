import { randomUUID } from 'crypto';
import 'dotenv/config';
import { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { User } from '../../../entity/User';
import {
	generateToken,
	hashPassword,
	isPasswordValid,
	ITokenPayload,
	verifyToken,
} from '../../../service/Auth';

describe('JWT token generation and verification flow', () => {
	const validPayload: ITokenPayload = { id: randomUUID(), email: 'valid@test.com' };
	const token = generateToken(validPayload);

	test('returns payload for valid token', () => {
		const payload = verifyToken(token) as JwtPayload;

		expect(payload.id).toBe(validPayload.id);
		expect(payload.email).toBe(validPayload.email);
	});

	test('throws an error for tempered token', () => {
		expect(() => verifyToken(`bad_${token}`)).toThrow(JsonWebTokenError);
	});
});

describe('Password hashing and validation flow', () => {
	const validPassword = '123456';
	const invalidPassword = '12345';
	let user = new User();

	beforeAll(async () => {
		const hashedPassword = await hashPassword(validPassword);
		user = new User();
		user.passwordHash = hashedPassword;
	});

	test('returns true for valid password', async () => {
		expect(await isPasswordValid(validPassword, user)).toBe(true);
	});

	test('returns false for invalid password', async () => {
		expect(await isPasswordValid(invalidPassword, user)).toBe(false);
	});
});
