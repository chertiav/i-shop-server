import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { BoilerPartsService } from './boiler-parts.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import {
	ApiBody,
	ApiCookieAuth,
	ApiOkResponse,
	ApiParam,
	ApiQuery,
	ApiTags,
} from '@nestjs/swagger';
import {
	BoilerPartsQuery,
	BoilerPartsResponse,
	FindByNameBody,
	GetBestsellerResponse,
	GetNewResponse,
	PaginateAndFilterResponse,
	SearchBody,
} from './response';
import { BoilerParts } from './models/boiler-parts.model';
@ApiTags('boiler-parts')
@Controller('boiler-parts')
export class BoilerPartsController {
	constructor(private readonly boilerPartsService: BoilerPartsService) {}
	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiQuery({ type: BoilerPartsQuery })
	@ApiOkResponse({ type: PaginateAndFilterResponse })
	@Get()
	paginateAndFilter(
		@Query() query,
	): Promise<{ rows: BoilerParts[]; count: number }> {
		return this.boilerPartsService.paginateAndFilter(query);
	}
	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiOkResponse({ type: BoilerPartsResponse })
	@Get('find/:id')
	getOne(@Param('id') id: string): Promise<BoilerParts> {
		return this.boilerPartsService.findOneById(id);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiOkResponse({ type: GetBestsellerResponse })
	@Get('bestsellers')
	getBestseller(): Promise<{ rows: BoilerParts[]; count: number }> {
		return this.boilerPartsService.bestsellers();
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiOkResponse({ type: GetNewResponse })
	@Get('new')
	getNew(): Promise<{ rows: BoilerParts[]; count: number }> {
		return this.boilerPartsService.new();
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiBody({ type: SearchBody })
	@ApiOkResponse({ type: BoilerPartsResponse })
	@Post('search')
	search(
		@Body() { search }: SearchBody,
	): Promise<{ rows: BoilerParts[]; count: number }> {
		return this.boilerPartsService.searchByString(search);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiBody({ type: FindByNameBody })
	@ApiOkResponse({ type: BoilerPartsResponse })
	@Post('name')
	getByName(@Body() { name }: FindByNameBody): Promise<BoilerParts> {
		return this.boilerPartsService.findOneByName(name);
	}
}
