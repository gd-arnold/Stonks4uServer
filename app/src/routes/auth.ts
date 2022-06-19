import express from 'express';
import { register, login } from '../controller/auth';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth';
import validate from '../middleware/validate';

const authRouter = express.Router();

authRouter.post('/register', validate(RegisterUserDTO), register);
authRouter.post('/login', validate(LoginUserDTO), login);

export default authRouter;
