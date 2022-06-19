import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT } from '../config/config';

const UserRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string) => {
	return await UserRepository.findOneBy({ email });
};

export const save = async (input: Partial<User>) => {
	const user = UserRepository.create(input);
	await UserRepository.save(user);

	return user;
};
