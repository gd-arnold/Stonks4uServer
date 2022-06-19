import express from 'express';
import 'reflect-metadata';
import { AppDataSource } from './config/data-source';
import { connectToDB } from './connect-db';
import cors from 'cors';
import { App } from './config/config';
import authRouter from './routes/auth';

const bootstrapApp = () => {
	connectToDB().then(() => AppDataSource.runMigrations());

	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/auth', authRouter);

	app.listen(App.port, () => console.log(`UP & RUNNING ON PORT ${App.port}`));

	return app;
};

export default bootstrapApp;
