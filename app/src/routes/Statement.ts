import express from 'express';
import { StatementController } from '../controller/Statement';
import { StatementDTO } from '../dto/Statement';
import { auth } from '../middleware/auth';
import validate from '../middleware/validate';

const StatementRouter = express.Router();

StatementRouter.use(auth);

StatementRouter.post('/', validate(StatementDTO), StatementController.post);

export default StatementRouter;
