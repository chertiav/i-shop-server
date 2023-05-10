import { ApiProperty } from '@nestjs/swagger';

export class BoilerPartsQuery {
	@ApiProperty({ default: 20 })
	limit: number;

	@ApiProperty({ default: 0 })
	offset: number;
}
export class SearchBody {
	@ApiProperty()
	search: string;
}
export class FindByNameBody {
	@ApiProperty()
	name: string;
}
export class BoilerPartsResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	boiler_manufacturer: string;

	@ApiProperty()
	price: number;

	@ApiProperty()
	parts_manufacturer: string;

	@ApiProperty()
	vendor_code: string;

	@ApiProperty()
	name: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	images: string[];

	@ApiProperty()
	in_stock: number;

	@ApiProperty()
	bestsellers: boolean;

	@ApiProperty()
	new: boolean;

	@ApiProperty()
	popularity: number;

	@ApiProperty()
	compatibility: string;

	@ApiProperty()
	createdAt: string;

	@ApiProperty()
	updatedAt: string;
}

class BestsellerBoilerPartsResponse extends BoilerPartsResponse {
	@ApiProperty({ default: true })
	bestsellers: boolean;
}
class NewBoilerPartsResponse extends BoilerPartsResponse {
	@ApiProperty({ default: true })
	new: boolean;
}
export class PaginateAndFilterResponse {
	@ApiProperty()
	count: number;
	@ApiProperty({ type: BoilerPartsResponse, isArray: true })
	rows: BoilerPartsResponse;
}

export class GetBestsellerResponse {
	@ApiProperty()
	count: number;
	@ApiProperty({ type: BoilerPartsResponse, isArray: true })
	rows: BestsellerBoilerPartsResponse;
}
export class GetNewResponse {
	@ApiProperty()
	count: number;
	@ApiProperty({ type: BoilerPartsResponse, isArray: true })
	rows: NewBoilerPartsResponse;
}
