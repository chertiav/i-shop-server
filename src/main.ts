import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './modules/app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as parseDbUrl from 'parse-database-url';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.use(
		session({
			secret: 'keyword',
			resave: false,
			saveUninitialized: false,
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.enableCors({
		credentials: true,
		origin: [
			'http://localhost:3000',
			'https://i-shop-client-production.up.railway.app/',
		],
	});

	const config = new DocumentBuilder()
		.setTitle('Название интернет магазина')
		.setDescription('api documentation')
		.setVersion('1.0')
		.addTag('api')
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('swagger', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
	});

	const dbConfig = parseDbUrl(process.env.DATABASE_URL);
	console.log(dbConfig);

	await app.listen(process.env.port || 5000);
}
bootstrap();
