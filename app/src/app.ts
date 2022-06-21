import express from 'express';
import 'reflect-metadata';
import { connectToDB } from './db';
import cors from 'cors';
import { App } from './config/config';
import authRouter from './routes/auth';

export const createApp = () => {
	const app = express();

	app.use(cors());
	app.use(express.json());

	app.use('/auth', authRouter);

	return app;
};

export const bootstrapApp = async () => {
	await connectToDB();

	const app = createApp();

	app.listen(App.port, () => console.log(`UP & RUNNING ON PORT ${App.port}`));

	return app;
};
