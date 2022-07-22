import { Expose } from 'class-transformer';
import { IsDefined, IsIn, MaxLength, Min, MinLength } from 'class-validator';
import { StatementCategoryTypeType } from '../entity/StatementCategory';

export class StatementCategoryDTO {
	@Expose()
	@IsDefined()
	@MinLength(1)
	@MaxLength(255)
	name: string;

	@Expose()
	@IsDefined()
	@IsIn(['income', 'expense'])
	type: StatementCategoryTypeType;
}
