import express from 'express';
import { StatementCategoryController } from '../controller/StatementCategory';
import { auth } from '../middleware/auth';

const StatementCategoryRouter = express.Router();

StatementCategoryRouter.use(auth);

StatementCategoryRouter.get('/:userId', StatementCategoryController.get.all);
StatementCategoryRouter.get('/income/:userId', StatementCategoryController.get.income);
StatementCategoryRouter.get('/expense/:userId', StatementCategoryController.get.expense);

StatementCategoryRouter.get('/default', StatementCategoryController.get.default.all);
StatementCategoryRouter.get('/default/income', StatementCategoryController.get.default.income);
StatementCategoryRouter.get('/default/expense', StatementCategoryController.get.default.expense);

StatementCategoryRouter.get('/custom/:userId', StatementCategoryController.get.custom.all);
StatementCategoryRouter.get(
	'/custom/:userId/income',
	StatementCategoryController.get.custom.income
);
StatementCategoryRouter.get(
	'/custom/:userId/expense',
	StatementCategoryController.get.custom.expense
);

export default StatementCategoryRouter;
