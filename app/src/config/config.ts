import 'dotenv/config';

export const App = {
	port: Number(process.env.PORT),
	environment: process.env.NODE_ENV,
};

export const DB = {
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	certificate: process.env.DB_CA_CERT,
};

export const JWT = {
	key: process.env.JWT_SECRET_KEY as string,
};
