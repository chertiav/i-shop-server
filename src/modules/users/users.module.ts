import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
//======================================================
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './models/users.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [SequelizeModule.forFeature([User]), AuthModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
