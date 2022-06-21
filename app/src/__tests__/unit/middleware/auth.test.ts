import { Request, Response, NextFunction } from 'express';
import { auth } from '../../../middleware/auth';
import { generateToken, ITokenPayload } from '../../../service/auth';

describe('Auth middleware suite', () => {
	const buildResponse = (overrides?: Object) => {
		const res = {
			json: jest.fn((body: Object) => res) as any,
			status: jest.fn((code: number) => res) as any,
			...overrides,
		} as Response;

		return res;
	};

	test('Returns authorization denied when no authorization header is present', () => {
		const req = {
			headers: {},
		} as Request;

		const res = buildResponse();

		const next = jest.fn(() => {}) as NextFunction;

		auth(req, res, next);
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalledWith({
			message: 'No auth token found. Authorization denied.',
		});
		expect(res.json).toHaveBeenCalledTimes(1);
	});
	test('Returns verification failed when JWT token is invalid', () => {
		const req = {
			headers: { authorization: 'invalid-token' },
		} as Request;

		const res = buildResponse();

		const next = jest.fn(() => {}) as NextFunction;

		auth(req, res, next);
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.status).toHaveBeenCalledTimes(1);
		expect(res.json).toHaveBeenCalledWith({ message: 'Token verification failed.' });
		expect(res.json).toHaveBeenCalledTimes(1);
	});
	test('Sets userPayload as a property on request and calls next middleware on valid JWT token', () => {
		const payload: ITokenPayload = {
			id: 1,
			email: 'test',
		};

		const req = {
			headers: { authorization: generateToken(payload) },
			userPayload: {} as IUserPayload,
		} as Request;

		const res = buildResponse();

		const next = jest.fn(() => {}) as NextFunction;

		auth(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(next).toHaveBeenCalledTimes(1);
		(Object.keys(payload) as Array<keyof ITokenPayload>).forEach((key) =>
			expect(req.userPayload[key]).toEqual(payload[key])
		);
		expect(res.status).not.toHaveBeenCalled();
		expect(res.json).not.toHaveBeenCalled();
	});
});
