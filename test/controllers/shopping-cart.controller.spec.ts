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
import { BoilerPartsService } from '../../src/modules/boiler-parts/boiler-parts.service';
import { UsersService } from '../../src/modules/users/users.service';
import { ShoppingCart } from '../../src/modules/shopping-cart/models/shopping-cart.model';
import { ShoppingCartModule } from '../../src/modules/shopping-cart/shopping-cart.module';

const mockedUser = {
	userName: 'John',
	email: 'john@gmail.com',
	password: 'john123',
};
describe('Shopping cart Controller', () => {
	let app: INestApplication;
	let boilerPartsService: BoilerPartsService;
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
				BoilerPartsModule,
				AuthModule,
				ShoppingCartModule,
			],
		}).compile();

		boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService);
		usersService = testModule.get<UsersService>(UsersService);

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

	beforeEach(async () => {
		const cart = new ShoppingCart();
		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});
		const part = await boilerPartsService.findOneById(3);
		cart.userId = user.id;
		cart.partId = part.id;
		cart.boiler_manufacturer = part.boiler_manufacturer;
		cart.parts_manufacturer = part.parts_manufacturer;
		cart.price = part.price;
		cart.in_stock = part.in_stock;
		cart.image = [part.images[0]];
		cart.name = part.name;
		cart.total_price = part.price;
		return cart.save();
	});

	afterEach(async () => {
		await User.destroy({
			where: { userName: mockedUser.userName.toLowerCase() },
		});
		await ShoppingCart.destroy({
			where: { partId: 3 },
		});
	});

	it('should get all cart items', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		const response = await request(app.getHttpServer())
			.get(`/shopping-cart/${user.id}`)
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body).toEqual(
			expect.arrayContaining([
				{
					id: expect.any(Number),
					userId: user.id,
					partId: expect.any(Number),
					boiler_manufacturer: expect.any(String),
					price: expect.any(Number),
					parts_manufacturer: expect.any(String),
					name: expect.any(String),
					image: expect.any(Array),
					count: expect.any(Number),
					total_price: expect.any(Number),
					in_stock: expect.any(Number),
					createdAt: expect.any(String),
					updatedAt: expect.any(String),
				},
			]),
		);
	});

	it('should add cart items', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		await request(app.getHttpServer())
			.post(`/shopping-cart/add`)
			.send({
				userName: user.userName,
				partId: 5,
				userId: user.id,
			})
			.set('Cookie', login.headers['set-cookie']);

		const response = await request(app.getHttpServer())
			.get(`/shopping-cart/${user.id}`)
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body.find((item) => item.partId === 5)).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				userId: user.id,
				partId: 5,
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				name: expect.any(String),
				image: expect.any(Array),
				count: expect.any(Number),
				total_price: expect.any(Number),
				in_stock: expect.any(Number),
				createdAt: expect.any(String),
				updatedAt: expect.any(String),
			}),
		);
	});

	it('should get updated count of  cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.patch(`/shopping-cart/count/3`)
			.send({ count: 2 })
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body).toEqual({ count: 2 });
	});

	it('should get updated total_price of  cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const response = await request(app.getHttpServer())
			.patch(`/shopping-cart/total-price/3`)
			.send({ total_price: 20000 })
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body).toEqual({ total_price: 20000 });
	});

	it('should delete one cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		await request(app.getHttpServer())
			.delete(`/shopping-cart/one/3`)
			.set('Cookie', login.headers['set-cookie']);

		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		const response = await request(app.getHttpServer())
			.get(`/shopping-cart/${user.id}`)
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body.find((item) => item.partId === 3)).toBeUndefined();
	});

	it('should delete all cart item', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		await request(app.getHttpServer())
			.delete(`/shopping-cart/all/${user.id}`)
			.set('Cookie', login.headers['set-cookie']);

		const response = await request(app.getHttpServer())
			.get(`/shopping-cart/${user.id}`)
			.set('Cookie', login.headers['set-cookie']);

		expect(response.body).toStrictEqual([]);
	});
});
