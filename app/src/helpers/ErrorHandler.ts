import { Response } from 'express';
import { App } from '../config/config';
import { ClientError } from './ClientError';

export const ErrorHandler = {
	controller: (res: Response, error: any) => {
		if (error instanceof ClientError) {
			return res.status(error.status).json({ message: error.message });
		}

		return res.status(500).json({
			message:
				App.environment === 'production' ? 'Something went wrong. Please try again later.' : error,
		});
	},
};
