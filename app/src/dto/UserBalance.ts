import { Expose } from 'class-transformer';
import { IsDefined, IsPositive, Max, Min } from 'class-validator';

export class UserBalanceDTO {
	@Expose()
	@IsDefined()
	@IsPositive()
	@Max(Math.pow(10, 9) - 1)
	balance: number;
}
