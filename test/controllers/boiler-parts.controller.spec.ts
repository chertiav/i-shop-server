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
import { BoilerPartsModule } from '../../src/modules/boiler-parts/boiler-parts.module';
import { ApiProperty } from '@nestjs/swagger';

const mockedUser = {
	userName: 'John',
	email: 'john@gmail.com',
	password: 'john123',
};
describe('Boiler Parts Controller', () => {
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
				BoilerPartsModule,
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

	it('should get one part', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.get('/boiler-parts/find/3')
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body).toEqual(
			expect.objectContaining({
				id: 3,
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				vendor_code: expect.any(String),
				name: expect.any(String),
				description: expect.any(String),
				images: expect.any(Array),
				in_stock: expect.any(Number),
				bestsellers: expect.any(Boolean),
				new: expect.any(Boolean),
				popularity: expect.any(Number),
				compatibility: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			}),
		);
	});

	it('should get bestsellers', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.get('/boiler-parts/bestsellers')
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body.rows).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					vendor_code: expect.any(String),
					name: expect.any(String),
					description: expect.any(String),
					images: expect.any(Array),
					in_stock: expect.any(Number),
					bestsellers: true,
					new: expect.any(Boolean),
					popularity: expect.any(Number),
					compatibility: expect.any(String),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		);
	});

	it('should get new', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.get('/boiler-parts/new')
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body.rows).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					vendor_code: expect.any(String),
					name: expect.any(String),
					description: expect.any(String),
					images: expect.any(Array),
					in_stock: expect.any(Number),
					bestsellers: expect.any(Boolean),
					new: true,
					popularity: expect.any(Number),
					compatibility: expect.any(String),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		);
	});

	it('should search by string', async () => {
		const body = { search: 'nos' };
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.post('/boiler-parts/search')
			.send(body)
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body.rows.length).toBeLessThanOrEqual(20);

		response.body.rows.forEach((element) => {
			expect(element.name.toLowerCase()).toContain(body.search);
		});

		expect(response.body.rows).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					vendor_code: expect.any(String),
					name: expect.any(String),
					description: expect.any(String),
					images: expect.any(Array),
					in_stock: expect.any(Number),
					bestsellers: expect.any(Boolean),
					new: expect.any(Boolean),
					popularity: expect.any(Number),
					compatibility: expect.any(String),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		);
	});

	it('should get by name', async () => {
		const body = { name: 'Nihil quis.' };
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.post('/boiler-parts/name')
			.send(body)
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				vendor_code: expect.any(String),
				name: 'Nihil quis.',
				description: expect.any(String),
				images: expect.any(Array),
				in_stock: expect.any(Number),
				bestsellers: expect.any(Boolean),
				new: expect.any(Boolean),
				popularity: expect.any(Number),
				compatibility: expect.any(String),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			}),
		);
	});
});
