import express from 'express';
import 'reflect-metadata';
import Database from './db';
import cors from 'cors';
import { App } from './config/config';
import AuthRouter from './routes/Auth';
import StatementCategoryRouter from './routes/StatementCategory';
import StatementRouter from './routes/Statement';

export const createApp = () => {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/auth', AuthRouter);
	app.use('/statement', StatementRouter);
	app.use('/statement-category', StatementCategoryRouter);
	return app;
};

export const bootstrapApp = async () => {
	await Database.connect();

	const app = createApp();

	app.listen(App.port, () => console.log(`UP & RUNNING ON PORT ${App.port}`));

	return app;
};
