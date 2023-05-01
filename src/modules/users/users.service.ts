import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
//============================================
import { User } from './models/users.model';
import { createUserDTO } from './dto';

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User)
		private readonly userRepository: typeof User,
	) {}

	async findOne(filter: {
		where: { id?: number | string; userName?: string; email?: string };
	}): Promise<User> {
		try {
			return this.userRepository.findOne({ ...filter });
		} catch (error) {
			throw new Error(error);
		}
	}

	async create(
		createUserDTO: createUserDTO,
	): Promise<User | { warningMessage: string }> {
		const existingByUserName = await this.findOne({
			where: { userName: createUserDTO.userName },
		});
		const existingByUserEmail = await this.findOne({
			where: { email: createUserDTO.email },
		});
		if (existingByUserName) {
			return { warningMessage: 'Пользователь с таким именем уже существует' };
		}
		if (existingByUserEmail) {
			return { warningMessage: 'Пользователь с таким email уже существует' };
		}
		const hashedPassword = await bcrypt.hash(createUserDTO.password, 7);
		const user = new User({
			userName: createUserDTO.userName.toLowerCase(),
			email: createUserDTO.email,
			password: hashedPassword,
		});
		return user.save();
	}
}
