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
import { ShoppingCartService } from '../../src/modules/shopping-cart/shopping-cart.service';
import { elementAt } from 'rxjs';

const mockedUser = {
	userName: 'John',
	email: 'john@gmail.com',
	password: 'john123',
};
describe('Shopping cart Controller', () => {
	let app: INestApplication;
	let boilerPartsService: BoilerPartsService;
	let usersService: UsersService;
	let shoppingCartService: ShoppingCartService;

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
		shoppingCartService =
			testModule.get<ShoppingCartService>(ShoppingCartService);

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

	it('should return all cart items', async () => {
		const login = await request(app.getHttpServer())
			.post('/users/login')
			.send({ username: mockedUser.userName, password: mockedUser.password });

		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		const carts = await shoppingCartService.findAll(user.id);

		carts.forEach((element) =>
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			),
		);
	});

	it('should add cart items', async () => {
		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		await shoppingCartService.add({
			userName: mockedUser.userName.toLowerCase(),
			partId: 4,
			userId: user.id,
		});

		const carts = await shoppingCartService.findAll(user.id);

		expect(carts.find((element) => element.partId === 4)).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				userId: user.id,
				partId: 4,
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				name: expect.any(String),
				image: expect.any(Array),
				count: expect.any(Number),
				total_price: expect.any(Number),
				in_stock: expect.any(Number),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		);
	});

	it('should update count cart item', async () => {
		const result = await shoppingCartService.updateCount(2, 3);
		expect(result).toEqual({ count: 2 });
	});

	it('should update total_price cart item', async () => {
		const part = await boilerPartsService.findOneById(3);
		const result = await shoppingCartService.updateTotalPrice(
			part.price * 3,
			3,
		);
		expect(result).toEqual({ total_price: part.price * 3 });
	});

	it('should delete one cart item', async () => {
		await shoppingCartService.remove(3);

		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});

		const cart = await shoppingCartService.findAll(user.id);
		expect(cart.find((item) => item.partId === 3)).toBeUndefined();
	});

	it('should delete all cart items', async () => {
		const user = await usersService.findOne({
			where: { userName: mockedUser.userName.toLowerCase() },
		});
		await shoppingCartService.removeAll(user.id);

		const cart = await shoppingCartService.findAll(user.id);
		expect(cart).toStrictEqual([]);
	});
});
