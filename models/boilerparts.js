'use strict';
const { Model } = require('sequelize');
const { Column, DataType } = require('sequelize-typescript');
module.exports = (sequelize, DataTypes) => {
	class BoilerParts extends Model {
		static associate(models) {}
	}
	BoilerParts.init(
		{
			boiler_manufacturer: DataTypes.string,
			price: DataTypes.integer,
			parts_manufacturer: DataTypes.string,
			vendor_code: DataTypes.string,
			name: DataTypes.string,
			description: DataTypes.string,
			images: DataTypes.Array(DataTypes.string),
			in_stock: DataTypes.number,
			bestsellers: DataTypes.boolean,
			new: DataTypes.boolean,
			popularity: DataTypes.number,
			compatibility: DataTypes.string,
		},
		{
			sequelize,
			modelName: 'BoilerParts',
		},
	);
	return BoilerParts;
};
