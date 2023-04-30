'use strict';
const { faker } = require('@faker-js/faker');
const boilersManufactures = [
	'Ariston',
	'Chaffoteaux&Maury',
	'Baxi',
	'Bongioanni',
	'Buderus',
	'Strategist',
	'Henry',
	'Nortwest',
];
const partsManufactures = [
	'Azure',
	'Gloves',
	'Cambridge-shire',
	'Salmon',
	'Montana',
	'Sensor',
	'Lesly',
	'Radian',
	'Gasoline',
	'Croatia',
];

const boilersData = [...Array(100)].map(() => ({
	boiler_manufacturer:
		boilersManufactures[Math.floor(Math.random() * boilersManufactures.length)],
	price: faker.random.numeric(4),
	parts_manufacturer:
		partsManufactures[Math.floor(Math.random() * partsManufactures.length)],
	vendor_code: faker.internet.password(),
	name: faker.lorem.sentence(2),
	description: faker.lorem.sentence(10),
	images: [...Array(7)].map(
		() => `${faker.image.technics()}?random=${faker.random.numeric(30)}`,
	),

	in_stock: faker.random.numeric(1),
	bestsellers: faker.datatype.boolean(),
	new: faker.datatype.boolean(),
	popularity: faker.random.numeric(3),
	compatibility: faker.lorem.sentence(7),
	createdAt: new Date(),
	updatedAt: new Date(),
}));

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('BoilerParts', boilersData);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('BoilerParts', null, {});
	},
};
