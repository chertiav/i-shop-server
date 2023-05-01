import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { ShoppingCartService } from './shopping-cart.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { BoilerPartsModule } from '../boiler-parts/boiler-parts.module';
import { ShoppingCart } from './models/shopping-cart.model';

@Module({
	imports: [
		SequelizeModule.forFeature([ShoppingCart]),
		UsersModule,
		BoilerPartsModule,
	],
	controllers: [ShoppingCartController],
	providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
