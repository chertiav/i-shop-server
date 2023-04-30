import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createUserDTO {
	@ApiProperty({ default: 'Andrey' })
	@IsNotEmpty()
	readonly userName: string;

	@ApiProperty({ default: '123' })
	@IsNotEmpty()
	readonly password: string;

	@ApiProperty({ default: 'test@gmail.com ' })
	@IsNotEmpty()
	readonly email: string;
}
