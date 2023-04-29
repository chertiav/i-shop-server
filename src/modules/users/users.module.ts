import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
//======================================================
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/users.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [SequelizeModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
