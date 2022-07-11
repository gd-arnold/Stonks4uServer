import 'dotenv/config';

export const App = {
	port: Number(process.env.PORT),
	environment: process.env.NODE_ENV,
};

export const DB = {
	host: App.environment === 'test' ? process.env.POSTGRES_HOST : process.env.DB_HOST,
	port:
		App.environment === 'test'
			? Number(process.env.POSTGRES_LOCAL_PORT)
			: Number(process.env.DB_PORT),
	username: App.environment === 'test' ? process.env.POSTGRES_USER : process.env.DB_USERNAME,
	password: App.environment === 'test' ? process.env.POSTGRES_PASSWORD : process.env.DB_PASSWORD,
	database: App.environment === 'test' ? process.env.POSTGRES_DB : process.env.DB_NAME,
	certificate: App.environment === 'test' ? undefined : process.env.DB_CA_CERT,
};

export const JWT = {
	key: process.env.JWT_SECRET_KEY as string,
};
