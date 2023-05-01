import { INestApplication, NestModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
//==================================================================
import { SequelizeConfigService } from '../../src/confiiguration/sequelizeConfig.service';
import { databaseConfig } from '../../src/confiiguration/configuration';
import { UsersModule } from '../../src/modules/users/users.module';
import { User } from '../../src/modules/users/models/users.model';
import { UsersService } from '../../src/modules/users/users.service';

describe('User Controller', () => {
	let app: INestApplication;
	let usersService: UsersService;

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
				UsersModule,
			],
		}).compile();

		usersService = testModule.get<UsersService>(UsersService);
		app = testModule.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await User.destroy({
			where: { userName: 'test' },
		});
	});

	it('should create user', async () => {
		const newUser = {
			userName: 'Test',
			email: 'teste@gmail.com',
			password: 'test123',
		};

		const user = (await usersService.create(newUser)) as User;
		const passwordIsValid = await bcrypt.compare(
			newUser.password,
			user.password,
		);
		expect(user.userName).toBe(newUser.userName.toLowerCase());
		expect(passwordIsValid).toBe(true);
		expect(user.email).toBe(newUser.email);
	});
});
