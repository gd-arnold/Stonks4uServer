interface IUserPayload {
	id: number;
	email: string;
}

declare namespace Express {
	export interface Request {
		userPayload: IUserPayload;
	}
}
