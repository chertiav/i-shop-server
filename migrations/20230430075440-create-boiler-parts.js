'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('BoilerParts', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			boiler_manufacturer: {
				type: Sequelize.STRING,
			},
			price: {
				type: Sequelize.INTEGER,
			},
			parts_manufacturer: {
				type: Sequelize.STRING,
			},
			vendor_code: {
				type: Sequelize.STRING,
			},
			name: {
				type: Sequelize.STRING,
			},
			description: {
				type: Sequelize.STRING,
			},
			images: {
				type: Sequelize.ARRAY(Sequelize.STRING),
			},
			in_stock: {
				type: Sequelize.INTEGER,
			},
			bestsellers: {
				type: Sequelize.BOOLEAN,
			},
			new: {
				type: Sequelize.BOOLEAN,
			},
			popularity: {
				type: Sequelize.INTEGER,
			},
			compatibility: {
				type: Sequelize.STRING,
			},

			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('BoilerParts');
	},
};
