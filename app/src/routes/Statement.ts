import express from 'express';
import { StatementController } from '../controller/Statement';
import { StatementDTO } from '../dto/Statement';
import { auth } from '../middleware/auth';
import validate from '../middleware/validate';

const StatementRouter = express.Router();

StatementRouter.use(auth);

// GET
StatementRouter.get('/:userId', StatementController.get.all);
StatementRouter.get('/:userId/income', StatementController.get.income);
StatementRouter.get('/:userId/expense', StatementController.get.expense);

// POST
StatementRouter.post('/', validate(StatementDTO), StatementController.post);

// DELETE
StatementRouter.delete('/:statementId', StatementController.delete);

export default StatementRouter;
