import { NextFunction, Request, Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '../../../../dto/Auth';
import { buildResponse } from '../../../utils/express.utils';
import validate from '../../../../middleware/validate';

const buildValidDTOs = () => {
	const validLoginDTO: LoginUserDTO = {
		email: 'test@test.com',
		password: '123456',
	};
	const validRegisterDTO: RegisterUserDTO = {
		...validLoginDTO,
		fullName: 'Test Test',
	};
	return { validLoginDTO, validRegisterDTO };
};

describe('Auth validation middleware test suite', () => {
	const { validLoginDTO, validRegisterDTO } = buildValidDTOs();
	const invalidDTOTestAssertions = (req: Request, res: Response, next: NextFunction) => {
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalled();
		expect(res.json).toHaveBeenCalledTimes(1);
	};
	const validDTOTestAssertions = (req: Request, res: Response, next: NextFunction) => {
		expect(next).toHaveBeenCalled();
		expect(next).toHaveBeenCalledTimes(1);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	};

	const middlewareArgumentsFactory = (DTO: any) => {
		const req = { body: DTO } as Request;
		const res = buildResponse();
		const next = jest.fn(() => {}) as NextFunction;

		return { req, res, next };
	};

	describe('Login validation test suite', () => {
		describe('Returns validation failed on', () => {
			test('undefined email or password', async () => {
				const undefinedEmailOrPasswordDTOs = [
					{ ...validLoginDTO, email: undefined },
					{ ...validLoginDTO, password: undefined },
				];

				undefinedEmailOrPasswordDTOs.forEach(async (undefinedDTO) => {
					const { req, res, next } = middlewareArgumentsFactory(undefinedDTO);

					const middleware = validate(LoginUserDTO);
					await middleware(req, res, next);
					invalidDTOTestAssertions(req, res, next);
				});
			});
			test('invalid email', async () => {
				const invalidEmailDTO = { ...validLoginDTO, email: 'invalid' };
				const { req, res, next } = middlewareArgumentsFactory(invalidEmailDTO);

				const middleware = validate(LoginUserDTO);
				await middleware(req, res, next);
				invalidDTOTestAssertions(req, res, next);
			});
			test('password less than 6 characters', async () => {
				const invalidPasswordDTO = { ...validLoginDTO, password: '12345' };
				const { req, res, next } = middlewareArgumentsFactory(invalidPasswordDTO);

				const middleware = validate(LoginUserDTO);
				await middleware(req, res, next);
				invalidDTOTestAssertions(req, res, next);
			});
			test('email or password more than 255 characters', async () => {
				const invalidEmailOrPasswordDTOs = [
					{ ...validLoginDTO, email: `test@${'t'.repeat(247)}.com` },
					{ ...validLoginDTO, password: '1'.repeat(256) },
				];

				invalidEmailOrPasswordDTOs.forEach(async (invalidDTO) => {
					const { req, res, next } = middlewareArgumentsFactory(invalidDTO);

					const middleware = validate(LoginUserDTO);
					await middleware(req, res, next);
					invalidDTOTestAssertions(req, res, next);
				});
			});
		});
		test('Calls next middleware on valid dto', async () => {
			const { req, res, next } = middlewareArgumentsFactory(validLoginDTO);

			const middleware = validate(LoginUserDTO);
			await middleware(req, res, next);
			validDTOTestAssertions(req, res, next);
		});
	});
	describe('Register validation test suite', () => {
		describe('Returns validation failed on', () => {
			test('undefined fullName', async () => {
				const invalidFullNameDTO = { ...validRegisterDTO, fullName: undefined };
				const { req, res, next } = middlewareArgumentsFactory(invalidFullNameDTO);

				const middleware = validate(RegisterUserDTO);
				await middleware(req, res, next);
				invalidDTOTestAssertions(req, res, next);
			});
			test('fullName less than 1 character', async () => {
				const invalidFullNameDTO = { ...validRegisterDTO, fullName: '' };
				const { req, res, next } = middlewareArgumentsFactory(invalidFullNameDTO);

				const middleware = validate(RegisterUserDTO);
				await middleware(req, res, next);
				invalidDTOTestAssertions(req, res, next);
			});
			test('fullName more than 255 characters', async () => {
				const invalidFullNameDTO = { ...validRegisterDTO, fullName: 'f'.repeat(256) };
				const { req, res, next } = middlewareArgumentsFactory(invalidFullNameDTO);

				const middleware = validate(RegisterUserDTO);
				await middleware(req, res, next);
				invalidDTOTestAssertions(req, res, next);
			});
		});
		test('Calls next middleware on valid dto', async () => {
			const { req, res, next } = middlewareArgumentsFactory(validRegisterDTO);

			const middleware = validate(RegisterUserDTO);
			await middleware(req, res, next);
			validDTOTestAssertions(req, res, next);
		});
	});
});
