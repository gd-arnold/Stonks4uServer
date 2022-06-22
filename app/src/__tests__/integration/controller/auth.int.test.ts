import { Request } from 'express';
import { createApp } from '../../../app';
import { AppDataSource } from '../../../config/data-source';
import { login, register } from '../../../controller/auth';
import { connectToDB, resetDB } from '../../../db';
import { LoginUserDTO, RegisterUserDTO } from '../../../dto/auth';
import { User } from '../../../entity/user';
import { generateToken, ITokenPayload } from '../../../service/auth';
import { buildResponse } from '../../utils/express.utils';

describe('Auth controller suite', () => {
	beforeAll(async () => {
		await connectToDB();
	});
	afterAll(async () => {
		await resetDB();
		await AppDataSource.destroy();
	});

	const setup = () => {
		const repo = AppDataSource.getRepository(User);
		const loginUserDTO: LoginUserDTO = {
			email: 'test@test.com',
			password: '123456',
		};
		const registerUserDTO: RegisterUserDTO = {
			...loginUserDTO,
			fullName: 'Test Test',
		};
		return { repo, registerUserDTO, loginUserDTO };
	};
	const buildPayload = async (email: string) => {
		const { repo } = setup();
		const user = await repo.findOneBy({ email: email });
		const payload = { id: user!.id, email: user!.email } as ITokenPayload;
		return { user, payload };
	};
	describe('Register user suite', () => {
		test('Saves user in database and generates JWT token', async () => {
			const { repo, registerUserDTO } = setup();
			const req = { body: registerUserDTO } as Request;
			const res = buildResponse();
			await register(req, res);
			const { user, payload } = await buildPayload(registerUserDTO.email);
			expect(user).not.toBe(null);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ ...payload, token: generateToken(payload) });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test("Doesn't register user if the email is already taken", async () => {
			const { registerUserDTO } = setup();
			const req = { body: registerUserDTO } as Request;
			const res = buildResponse();
			await register(req, res);
			expect(res.status).toHaveBeenCalledWith(409);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'User already exists.' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
	});
	describe('Login user suite', () => {
		test("Doesn't login user with inexistent email", async () => {
			const { loginUserDTO } = setup();
			const req = { body: { ...loginUserDTO, email: 'invalid@i.com' } } as Request;
			const res = buildResponse();
			await login(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: "User doesn't exist." });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test("Doesn't login user with wrong password", async () => {
			const { loginUserDTO } = setup();
			const req = { body: { ...loginUserDTO, password: 'invalid12' } } as Request;
			const res = buildResponse();
			await login(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password.' });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
		test('Generates JWT token on successful login', async () => {
			const { loginUserDTO } = setup();
			const req = { body: loginUserDTO } as Request;
			const res = buildResponse();
			await login(req, res);
			const { payload } = await buildPayload(loginUserDTO.email);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith({ ...payload, token: generateToken(payload) });
			expect(res.json).toHaveBeenCalledTimes(1);
		});
	});
});
