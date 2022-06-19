import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { DB } from './config';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: DB.host,
	port: DB.port,
	username: DB.username,
	password: DB.password,
	database: DB.database,
	logging: false,
	synchronize: false,
	ssl: DB.certificate
		? {
				rejectUnauthorized: true,
				ca: DB.certificate.toString(),
		  }
		: false,
	entities: [`${__dirname}/../entity/**/*{.ts,.js}`],
	migrations: [`${__dirname}/../migration/**/*{.ts,.js}`],
});
