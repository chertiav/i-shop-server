import { INestApplication, NestModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
//==================================================================
import { SequelizeConfigService } from '../../src/confiiguration/sequelizeConfig.service';
import { databaseConfig } from '../../src/confiiguration/configuration';
import { User } from '../../src/modules/users/models/users.model';
import { AuthModule } from '../../src/modules/auth/auth.module';
import { AuthService } from '../../src/modules/auth/auth.service';
import { UsersService } from '../../src/modules/users/users.service';

const mockedUser = {
	userName: 'John',
	email: 'john@gmail.com',
	password: 'john123',
};
describe('Auth Service', () => {
	let app: INestApplication;
	let authService: AuthService;

	beforeEach(async () => {
		const testModule: TestingModule = await Test.createTestingModule({
			imports: [
				SequelizeModule.forRootAsync({
					imports: [ConfigModule],
					useClass: SequelizeConfigService,
				}),
				ConfigModule.forRoot({
					load: [databaseConfig],
				}),
				AuthModule,
			],
		}).compile();

		authService = testModule.get<AuthService>(AuthService);
		app = testModule.createNestApplication();
		await app.init();
	});

	beforeEach(async () => {
		const hashedPassword = await bcrypt.hash(mockedUser.password, 7);
		const user = new User({
			userName: mockedUser.userName.toLowerCase(),
			email: mockedUser.email,
			password: hashedPassword,
		});
		return user.save();
	});

	afterEach(async () => {
		await User.destroy({
			where: { userName: mockedUser.userName.toLowerCase() },
		});
	});

	it('should login user', async () => {
		const user = await authService.validateUser(
			mockedUser.userName.toLowerCase(),
			mockedUser.password,
		);

		expect(user.userName).toBe(mockedUser.userName.toLowerCase());
		expect(user.email).toBe(mockedUser.email);
	});
});
