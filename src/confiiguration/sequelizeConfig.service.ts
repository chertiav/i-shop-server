import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	SequelizeModuleOptions,
	SequelizeOptionsFactory,
} from '@nestjs/sequelize';
//========================================================
import { User } from '../modules/users/models/users.model';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
	constructor(private readonly configService: ConfigService) {}

	createSequelizeOptions(): SequelizeModuleOptions {
		const {
			sql: { dialect, host, port, username, password, database },
		} = this.configService.get('database');
		return {
			dialect,
			host,
			port,
			username,
			password,
			database,
			models: [User],
			synchronize: true,
			autoLoadModels: true,
			define: {
				charset: 'utf8',
				collate: 'utf8_general_ci',
			},
		};
	}
}
