import 'reflect-metadata';
import { DataSource } from 'typeorm';

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT);
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_NAME;

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: host,
	port: port,
	username: username,
	password: password,
	database: database,
	logging: false,
	synchronize: false,
	entities: ['../entity/**/*.ts'],
	migrations: ['../migration/**/*.ts'],
});
