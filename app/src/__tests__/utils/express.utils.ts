import { Response } from 'express';

export const buildResponse = (overrides?: Object) => {
	const res = {
		json: jest.fn((body: Object) => res) as any,
		status: jest.fn((code: number) => res) as any,
		send: jest.fn((body?: Object) => res) as any,
		...overrides,
	} as Response;

	return res;
};
