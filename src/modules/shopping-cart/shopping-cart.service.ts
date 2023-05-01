import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ShoppingCart } from './models/shopping-cart.model';
import { UsersService } from '../users/users.service';
import { BoilerPartsService } from '../boiler-parts/boiler-parts.service';
import { AddToCardDTO } from './dto';
import { isURL } from 'class-validator';

@Injectable()
export class ShoppingCartService {
	constructor(
		@InjectModel(ShoppingCart)
		private shoppingCartModel: typeof ShoppingCart,
		private readonly usersService: UsersService,
		private readonly boilerPartsService: BoilerPartsService,
	) {}

	async findAll(userId: number | string): Promise<ShoppingCart[]> {
		return this.shoppingCartModel.findAll({ where: { userId } });
	}

	async add(addToCartDTO: AddToCardDTO) {
		const cart = new ShoppingCart();
		const user = await this.usersService.findOne({
			where: { id: addToCartDTO.userId },
		});
		const part = await this.boilerPartsService.findOneById(addToCartDTO.partId);
		cart.userId = user.id;
		cart.partId = part.id;
		cart.boiler_manufacturer = part.boiler_manufacturer;
		cart.parts_manufacturer = part.parts_manufacturer;
		cart.price = part.price;
		cart.in_stock = part.in_stock;
		cart.image = [part.images[0]];
		cart.name = part.name;
		cart.total_price = part.price;
		return cart.save();
	}

	async updateCount(
		count: number,
		partId: number | string,
	): Promise<{ count: number }> {
		const [updatedCount, [updatedShoppingCart]] =
			await this.shoppingCartModel.update(
				{ count },
				{ where: { partId }, returning: true },
			);
		return { count: updatedShoppingCart.count };
	}

	async updateTotalPrice(
		total_price: number,
		partId: number | string,
	): Promise<{ total_price: number }> {
		const [updatedCount, [updatedShoppingCart]] =
			await this.shoppingCartModel.update(
				{ total_price },
				{ where: { partId }, returning: true },
			);
		return { total_price: updatedShoppingCart.total_price };
	}

	async remove(partId: number | string): Promise<void> {
		const part = await this.shoppingCartModel.findOne({ where: { partId } });
		await part.destroy();
	}
	async removeAll(userId: number | string): Promise<void> {
		await this.shoppingCartModel.destroy({ where: { userId } });
	}
}
