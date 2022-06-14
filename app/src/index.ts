import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();

app.get('/', (req: Request, res: Response) => {
	res.status(200).send({ message: 'stonks go brrrr' });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`UP & RUNNING ON PORT ${PORT}`));
