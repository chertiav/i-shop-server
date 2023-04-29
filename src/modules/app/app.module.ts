import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
//=========================================================
import { SequelizeConfigService } from '../../confiiguration/sequelizeConfig.service';
import { databaseConfig } from '../../confiiguration/configuration';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useClass: SequelizeConfigService,
		}),
		ConfigModule.forRoot({
			load: [databaseConfig],
		}),
		UsersModule,
		AuthModule,
	],
})
export class AppModule {}
