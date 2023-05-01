import { INestApplication, NestModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as session from 'express-session';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import * as passport from 'passport';
//==================================================================
import { SequelizeConfigService } from '../../src/confiiguration/sequelizeConfig.service';
import { databaseConfig } from '../../src/confiiguration/configuration';
import { User } from '../../src/modules/users/models/users.model';
import { AuthModule } from '../../src/modules/auth/auth.module';

const mockedUser = {
	userName: 'John',
	email: 'john@gmail.com',
	password: 'john123',
};
describe('Auth Controller', () => {
	let app: INestApplication;

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

		app = testModule.createNestApplication();
		app.use(
			session({
				secret: 'keyword',
				resave: false,
				saveUninitialized: false,
			}),
		);
		app.use(passport.initialize());
		app.use(passport.session());
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
		const response = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		expect(response.body.user.userName).toBe(mockedUser.userName.toLowerCase());
		expect(response.body.user.email).toBe(mockedUser.email);
		expect(response.body.msg).toBe('Logged in');
	});

	it('should login check', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const loginCheck = await request(app.getHttpServer())
			.get('/users/login-check')
			.set('Cookie', login.headers['set-cookie']);

		expect(loginCheck.body.userName).toBe(mockedUser.userName.toLowerCase());
		expect(loginCheck.body.email).toBe(mockedUser.email);
	});

	it('should logout', async () => {
		const response = await request(app.getHttpServer()).get('/users/logout');

		expect(response.body.msg).toBe('session has ended');
	});
});
