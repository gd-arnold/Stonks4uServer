import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const UserRepository = AppDataSource.getRepository(User);

export const UserService = {
	findUserByEmail: async (email: string) => {
		return await UserRepository.findOneBy({ email });
	},
	findUserById: async (id: string) => {
		return await UserRepository.findOneBy({ id });
	},
	save: async (input: Partial<User>) => {
		const user = UserRepository.create(input);
		await UserRepository.save(user);

		return user;
	},
};
