import {
	Body,
	Controller,
	Header,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDTO } from './dto';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	@Header('Content-type', 'application/json')
	createUser(@Body() createUserDTO: createUserDTO) {
		return this.userService.create(createUserDTO);
	}
}
