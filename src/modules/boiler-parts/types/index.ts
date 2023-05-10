import { Op } from 'sequelize';
export interface IBoilerPartsQuery {
	limit: string;
	offset: string;
	boiler: string | undefined;
	parts: string | undefined;
	priceFrom: string | undefined;
	priceTo: string | undefined;
}

export interface IBoilerPartsFilter {
	boiler_manufacturer: string | undefined;
	parts_manufacturer: string | undefined;
	price: { [Op.between]: number[] };
}
