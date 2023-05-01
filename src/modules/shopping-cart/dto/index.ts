import { IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCardDTO {
	@ApiProperty({ example: 'Andrey' })
	@IsNotEmpty()
	readonly userName: string;

	@ApiProperty({ example: 1 })
	@IsOptional()
	userId?: number;

	@ApiProperty({ example: 1 })
	@IsNotEmpty()
	readonly partId: number;
}
