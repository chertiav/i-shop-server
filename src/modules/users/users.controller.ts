import {
	Body,
	Controller,
	Get,
	Header,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDTO } from './dto';
import { LocalAuthGuard } from '../auth/local.auth.guard';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post('/signup')
	@HttpCode(HttpStatus.CREATED)
	@Header('Content-type', 'application/json')
	createUser(@Body() createUserDTO: createUserDTO) {
		return this.userService.create(createUserDTO);
	}

	@Post('/login')
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	login(@Req() request) {
		return { user: request.user, msg: 'Logged in' };
	}

	@Get('/login-check')
	@UseGuards(AuthenticatedGuard)
	loginCheck(@Req() request) {
		return request.user;
	}

	@Post('/logout')
	logout(@Req() request) {
		request.session.destroy();
		return { msg: 'session has ended' };
	}
}
