import express from 'express';
import { AuthController } from '../controller/Auth';
import { LoginUserDTO, RegisterUserDTO } from '../dto/Auth';
import validate from '../middleware/validate';

const AuthRouter = express.Router();

AuthRouter.post('/register', validate(RegisterUserDTO), AuthController.register);
AuthRouter.post('/login', validate(LoginUserDTO), AuthController.login);

export default AuthRouter;
