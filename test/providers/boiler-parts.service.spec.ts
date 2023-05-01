import { INestApplication, NestModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
//==================================================================
import { SequelizeConfigService } from '../../src/confiiguration/sequelizeConfig.service';
import { databaseConfig } from '../../src/confiiguration/configuration';
import { BoilerPartsModule } from '../../src/modules/boiler-parts/boiler-parts.module';
import { BoilerPartsService } from '../../src/modules/boiler-parts/boiler-parts.service';

describe('Boiler Parts Service', () => {
	let app: INestApplication;
	let boilerPartsService: BoilerPartsService;

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
			],
		}).compile();

		boilerPartsService = testModule.get<BoilerPartsService>(BoilerPartsService);
		app = testModule.createNestApplication();
		await app.init();
	});

	it('should find by id', async () => {
		const part = await boilerPartsService.findOneById(3);

		expect(part.dataValues).toEqual(
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
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		);
	});

	it('should find by name', async () => {
		const body = { name: 'Nihil quis.' };
		const part = await boilerPartsService.findOneByName(body.name);

		expect(part.dataValues).toEqual(
			expect.objectContaining({
				id: expect.any(Number),
				boiler_manufacturer: expect.any(String),
				price: expect.any(Number),
				parts_manufacturer: expect.any(String),
				vendor_code: expect.any(String),
				name: body.name,
				description: expect.any(String),
				images: expect.any(Array),
				in_stock: expect.any(Number),
				bestsellers: expect.any(Boolean),
				new: expect.any(Boolean),
				popularity: expect.any(Number),
				compatibility: expect.any(String),
				createdAt: expect.any(Date),
				updatedAt: expect.any(Date),
			}),
		);
	});

	it('should find by search string', async () => {
		const search = 'nos';
		const parts = await boilerPartsService.searchByString(search);

		expect(parts.rows.length).toBeLessThanOrEqual(20);

		parts.rows.forEach((element) => {
			expect(element.name.toLowerCase()).toContain(search);
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			);
		});
	});

	it('should find bestsellers', async () => {
		const parts = await boilerPartsService.bestsellers();
		parts.rows.forEach((element) => {
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			);
		});
	});

	it('should find new', async () => {
		const parts = await boilerPartsService.new();
		parts.rows.forEach((element) => {
			expect(element.dataValues).toEqual(
				expect.objectContaining({
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
					createdAt: expect.any(Date),
					updatedAt: expect.any(Date),
				}),
			);
		});
	});
});
