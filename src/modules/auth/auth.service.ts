import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
	constructor(private readonly usersService: UsersService) {}
	async validateUser(userName: string, password: string) {
		const user = await this.usersService.findOne({
			where: { userName: userName.toLowerCase() },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const passwordValid = await bcrypt.compare(password, user.password);
		if (!passwordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (user && passwordValid) {
			return {
				userId: user.id,
				userName: user.userName,
				email: user.email,
			};
		}
		return null;
	}
}
