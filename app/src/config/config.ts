import 'dotenv/config';

export const App = {
	port: Number(process.env.PORT),
	environment: process.env.NODE_ENV,
};

export const DB = {
	host: process.env.NODE_ENV === 'test' ? process.env.POSTGRES_HOST : process.env.DB_HOST,
	port:
		process.env.NODE_ENV === 'test'
			? Number(process.env.POSTGRES_LOCAL_PORT)
			: Number(process.env.DB_PORT),
	username: process.env.NODE_ENV === 'test' ? process.env.POSTGRES_USER : process.env.DB_USERNAME,
	password:
		process.env.NODE_ENV === 'test' ? process.env.POSTGRES_PASSWORD : process.env.DB_PASSWORD,
	database: process.env.NODE_ENV === 'test' ? process.env.POSTGRES_DB : process.env.DB_NAME,
	certificate: process.env.NODE_ENV === 'test' ? undefined : process.env.DB_CA_CERT,
};

export const JWT = {
	key: process.env.JWT_SECRET_KEY as string,
};
