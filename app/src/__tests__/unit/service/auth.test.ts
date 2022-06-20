import { User } from '../../../entity/user';
import { hashPassword, isPasswordValid } from '../../../service/auth';

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
