import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class BoilerParts extends Model {
	@Column
	boiler_manufacturer: string;

	@Column({ defaultValue: 0 })
	price: number;

	@Column
	parts_manufacturer: string;

	@Column
	vendor_code: string;

	@Column
	name: string;

	@Column
	description: string;

	@Column(DataType.ARRAY(DataType.STRING))
	images: string[];

	@Column({ defaultValue: 0 })
	in_stock: number;

	@Column({ defaultValue: false })
	bestsellers: boolean;

	@Column({ defaultValue: false })
	new: boolean;

	@Column
	popularity: number;

	@Column
	compatibility: string;
}
