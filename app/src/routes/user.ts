import express from 'express';
import { createUser } from '../controller/user';
import { RegisterUserDTO } from '../dto/user';
import validate from '../middleware/validate';

const userRouter = express.Router();

userRouter.post('/', validate(RegisterUserDTO), createUser);

export default userRouter;
