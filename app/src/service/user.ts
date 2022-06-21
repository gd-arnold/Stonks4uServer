import { AppDataSource } from '../config/data-source';
import { User } from '../entity/user';

const UserRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string) => {
	return await UserRepository.findOneBy({ email });
};

export const save = async (input: Partial<User>) => {
	const user = UserRepository.create(input);
	await UserRepository.save(user);

	return user;
};
