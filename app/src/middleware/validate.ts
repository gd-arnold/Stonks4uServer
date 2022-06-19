import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

const validate = (DTO: any) => async (req: Request, res: Response, next: NextFunction) => {
	// Transform request body object to an instance of DTO,
	// so it can later be validated by class-validator
	const output = plainToInstance(DTO, req.body);

	try {
		await validateOrReject(output, { validationError: { target: false } });
		next();
	} catch (errors: any) {
		res.status(400).json({ message: 'Validation failed.', errors });
	}
};

export default validate;
