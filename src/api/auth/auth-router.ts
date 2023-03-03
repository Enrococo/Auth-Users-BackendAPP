import express from 'express';
import { Joi, validate } from 'express-validation';
import { loginUserController, registerController } from './auth-controllers.js';
import bodyParser from 'body-parser';

const authRouter = express.Router();

const loginValidation = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

const app = express();
app.use(bodyParser.json());

authRouter.route('/register').post(registerController);
authRouter
  .route('/login')
  .post(validate(loginValidation, {}, {}), loginUserController);

export default authRouter;
