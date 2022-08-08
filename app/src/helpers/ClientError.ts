export class ClientError extends Error {
	status: number;

	constructor(status: number, ...params: any) {
		super(...params);
		this.status = status;
	}
}
