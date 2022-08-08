import { Expose, Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsDefined,
	IsIn,
	IsPositive,
	IsUUID,
	Max,
	MaxLength,
	Min,
	MinDate,
	MinLength,
} from 'class-validator';
import { StatementTypeType } from '../entity/Statement';

export class StatementDTO {
	@Expose()
	@IsDefined()
	@MinLength(1)
	@MaxLength(255)
	name: string;

	@Expose()
	@IsDefined()
	@IsIn(['income', 'expense'])
	type: StatementTypeType;

	@Expose()
	@IsDefined()
	@IsUUID()
	categoryId: string;

	@Expose()
	@IsDefined()
	@IsPositive()
	@Max(Math.pow(10, 9) - 1)
	amount: number;

	@Expose()
	@IsDefined()
	@MinLength(1)
	@MaxLength(255)
	recurrenceTypeAlias: string;

	@Expose()
	@Type(() => Date)
	@IsDefined()
	@IsDate()
	@MinDate(new Date())
	date: Date;

	@Expose()
	@Type(() => Boolean)
	@IsDefined()
	@IsBoolean()
	automaticPayment: boolean;
}
