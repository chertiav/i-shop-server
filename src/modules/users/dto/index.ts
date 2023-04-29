import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUserDTO {
	@ApiProperty()
	@IsNotEmpty()
	readonly userName: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly password: string;

	@ApiProperty()
	@IsNotEmpty()
	readonly email: string;
}
