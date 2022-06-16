import express, { Request, Response } from 'express';
import 'dotenv/config';
import { connectToDB } from './connect-db';

connectToDB();

const app = express();

app.get('/', (req: Request, res: Response) => {
	res.status(200).send({ message: `stonks go brrrr` });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`UP & RUNNING ON PORT ${PORT}`));
