import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { connectToDB } from './connect-db';
import cors from 'cors';
import userRouter from './routes/user';

const bootstrapApp = (PORT: number = Number(process.env.PORT)) => {
	connectToDB().then(() => AppDataSource.runMigrations());

	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/users', userRouter);

	app.listen(PORT, () => console.log(`UP & RUNNING ON PORT ${PORT}`));

	return app;
};

export default bootstrapApp;
