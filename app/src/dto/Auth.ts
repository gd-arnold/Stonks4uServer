import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, MaxLength, MinLength } from 'class-validator';

export class LoginUserDTO {
	@Expose()
	@IsDefined()
	@IsEmail()
	@MaxLength(255)
	email: string;

	@Expose()
	@IsDefined()
	@MinLength(6)
	@MaxLength(255)
	password: string;
}

export class RegisterUserDTO extends LoginUserDTO {
	@Expose()
	@IsDefined()
	@MinLength(1)
	@MaxLength(255)
	fullName: string;
}
