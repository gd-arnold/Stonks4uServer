import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user';
import bcrypt from 'bcrypt';

const UserRepository = AppDataSource.getRepository(User);

export const hashPassword = async (password: string, saltRounds: number = 10) => {
	const salt = await bcrypt.genSalt(saltRounds);
	const hash = await bcrypt.hash(password, salt);

	return hash;
};

export const userExists = async (email: string) => {
	return !!(await UserRepository.findOneBy({ email }));
};

export const save = async (input: Partial<User>) => {
	const user = UserRepository.create(input);
	await UserRepository.save(user);

	return user;
};
