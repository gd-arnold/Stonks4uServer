import express from 'express';
import { UserController } from '../controller/User';
import { UserBalanceDTO } from '../dto/UserBalance';
import { auth } from '../middleware/auth';
import validate from '../middleware/validate';

const UserRouter = express.Router();

UserRouter.use(auth);

UserRouter.put('/set-balance', validate(UserBalanceDTO), UserController.setBalance);

export default UserRouter;
