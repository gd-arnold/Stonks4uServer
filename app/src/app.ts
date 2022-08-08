import express from 'express';
import 'reflect-metadata';
import Database from './db';
import cors from 'cors';
import { App } from './config/config';
import AuthRouter from './routes/Auth';
import StatementCategoryRouter from './routes/StatementCategory';
import StatementRouter from './routes/Statement';
import UserRouter from './routes/User';
import cron from 'node-cron';
import { ProcessStatements } from './jobs/ProcessStatements';

export const bootstrapApp = async () => {
	await Database.connect();

	const app = createApp();

	app.listen(App.port, () => console.log(`UP & RUNNING ON PORT ${App.port}`));

	bootstrapJobs();

	return app;
};

export const createApp = () => {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/auth', AuthRouter);
	app.use('/user', UserRouter);
	app.use('/statement', StatementRouter);
	app.use('/statement-category', StatementCategoryRouter);

	return app;
};

export const bootstrapJobs = () => {
	cron.schedule('59 * * * *', ProcessStatements);
};
