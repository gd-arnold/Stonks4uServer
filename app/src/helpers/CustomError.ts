export class CustomError extends Error {
	status: number;

	constructor(status: number, ...params: any) {
		super(...params);
		this.status = status;
	}
}
