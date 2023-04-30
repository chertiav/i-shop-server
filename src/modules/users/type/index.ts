import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
	@ApiProperty({ default: 'Andrey' })
	username: string;

	@ApiProperty({ default: '123' })
	password: string;
}

class userResponse {
	@ApiProperty()
	userId: number;

	@ApiProperty()
	userName: string;

	@ApiProperty()
	email: string;
}
export class LoginUserResponse {
	@ApiProperty()
	user: userResponse;

	@ApiProperty()
	msg: string;
}

export class SignupResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	userName: string;

	@ApiProperty()
	password: string;

	@ApiProperty()
	email: string;

	@ApiProperty()
	updatedAt: string;

	@ApiProperty()
	createdAt: string;
}

export class LogoutUserResponse {
	@ApiProperty()
	msg: string;
}

export class LoginCheckResponse extends userResponse {}
