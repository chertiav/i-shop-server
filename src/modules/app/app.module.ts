import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
//=========================================================
import { SequelizeConfigService } from '../../confiiguration/sequelizeConfig.service';
import { UsersModule } from '../users/users.module';
import { databaseConfig } from '../../confiiguration/configuration';

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
	],
})
export class AppModule {}
