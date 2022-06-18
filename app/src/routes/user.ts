import express from 'express';
import { createUser, loginUser } from '../controller/user';
import { LoginUserDTO, RegisterUserDTO } from '../dto/user';
import validate from '../middleware/validate';

const userRouter = express.Router();

userRouter.post('/', validate(RegisterUserDTO), createUser);
userRouter.post('/auth', validate(LoginUserDTO), loginUser);

export default userRouter;
