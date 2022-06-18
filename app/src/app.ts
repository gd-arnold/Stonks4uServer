import express, { Request, Response } from 'express';
import { AppDataSource } from './config/data-source';
import { connectToDB } from './connect-db';

const bootstrapApp = (PORT: number = Number(process.env.PORT)) => {
	connectToDB().then(async () => await AppDataSource.runMigrations());

	const app = express();

	app.get('/', (req: Request, res: Response) => {
		res.status(200).send({ message: `stonks go brrrr` });
	});

	app.listen(PORT, () => console.log(`UP & RUNNING ON PORT ${PORT}`));

	return app;
};

export default bootstrapApp;
