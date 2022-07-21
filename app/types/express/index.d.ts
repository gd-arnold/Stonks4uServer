interface IUserPayload {
	id: string;
	email: string;
}

declare namespace Express {
	export interface Request {
		userPayload: IUserPayload;
	}
}
