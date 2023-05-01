import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import {
	ApiBody,
	ApiCookieAuth,
	ApiOkResponse,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger';
import { AddToCardDTO } from './dto';
import {
	AddToCartResponse,
	GetAllResponse,
	UpdateCountRequest,
	UpdateCountResponse,
	UpdateTotalPriceRequest,
	UpdateTotalPriceResponse,
} from './typex';
@ApiTags('shopping-cart')
@Controller('shopping-cart')
export class ShoppingCartController {
	constructor(private readonly shoppingCartService: ShoppingCartService) {}

	@UseGuards(AuthenticatedGuard)
	@ApiParam({ name: 'id' })
	@ApiCookieAuth()
	@ApiOkResponse({ type: [GetAllResponse] })
	@Get(':id')
	getAll(@Param('id') userId: string) {
		return this.shoppingCartService.findAll(userId);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiOkResponse({ type: AddToCartResponse })
	@Post('/add')
	addToCart(@Body() addToCard: AddToCardDTO) {
		return this.shoppingCartService.add(addToCard);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiBody({ type: UpdateCountRequest })
	@ApiOkResponse({ type: UpdateCountResponse })
	@Patch('/count/:id')
	updateCount(
		@Body() { count }: { count: number },
		@Param('id') partId: string,
	) {
		return this.shoppingCartService.updateCount(count, partId);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@ApiBody({ type: UpdateTotalPriceRequest })
	@ApiOkResponse({ type: UpdateTotalPriceResponse })
	@Patch('/total-price/:id')
	updateTotalPrice(
		@Body() { total_price }: { total_price: number },
		@Param('id') partId: string,
	) {
		return this.shoppingCartService.updateTotalPrice(total_price, partId);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@Delete('/one/:id')
	removeOne(@Param('id') partId: string) {
		return this.shoppingCartService.remove(partId);
	}

	@UseGuards(AuthenticatedGuard)
	@ApiCookieAuth()
	@Delete('/all/:id')
	removeAll(@Param('id') userId: string) {
		return this.shoppingCartService.removeAll(userId);
	}
}
