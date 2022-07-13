import express from 'express';
import { register, login } from '../controller/Auth';
import { LoginUserDTO, RegisterUserDTO } from '../dto/Auth';
import validate from '../middleware/validate';

const AuthRouter = express.Router();

AuthRouter.post('/register', validate(RegisterUserDTO), register);
AuthRouter.post('/login', validate(LoginUserDTO), login);

export default AuthRouter;
