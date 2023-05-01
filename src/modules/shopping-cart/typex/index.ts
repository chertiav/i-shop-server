import { ApiProperty } from '@nestjs/swagger';

class ShopingCartItem {
	@ApiProperty()
	id: number;
	@ApiProperty()
	name: string;
	@ApiProperty()
	price: number;
	@ApiProperty()
	images: string[];
	@ApiProperty()
	in_stock: number;
	@ApiProperty()
	parts_manufacturer: string;
	@ApiProperty()
	boiler_manufacturer: string;
	@ApiProperty()
	userId: number;
	@ApiProperty()
	partId: number;
	@ApiProperty()
	count: number;
	@ApiProperty()
	total_price: number;
	@ApiProperty()
	createdAt: string;
	@ApiProperty()
	updatedAt: string;
}

export class GetAllResponse extends ShopingCartItem {}
export class AddToCartResponse extends ShopingCartItem {}
export class UpdateCountResponse {
	@ApiProperty()
	count: number;
}
export class UpdateCountRequest {
	@ApiProperty()
	count: number;
}
export class UpdateTotalPriceResponse {
	@ApiProperty()
	total_price: number;
}
export class UpdateTotalPriceRequest {
	@ApiProperty()
	total_price: number;
}
