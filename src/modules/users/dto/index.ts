import { IsNotEmpty } from 'class-validator';

export class createUserDTO {
	@IsNotEmpty()
	readonly userName: string;

	@IsNotEmpty()
	readonly password: string;

	@IsNotEmpty()
	readonly email: string;
}
