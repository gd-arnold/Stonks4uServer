import { Expose } from 'class-transformer';
import { IsDefined, MaxLength, MinLength } from 'class-validator';

export class LoginUserDTO {
	@Expose()
	@IsDefined()
	@MinLength(1)
	@MaxLength(20)
	username: string;

	@Expose()
	@IsDefined()
	@MinLength(6)
	password: string;
}

export class RegisterUserDTO extends LoginUserDTO {
	@Expose()
	@IsDefined()
	@MinLength(1)
	fullName: string;
}
