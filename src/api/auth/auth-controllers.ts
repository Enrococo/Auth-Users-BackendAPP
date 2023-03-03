import crypto from 'node:crypto';
import { RequestHandler } from 'express';
import { User, UserModel } from '../users/user-schema.js';
import { encryptPassword, generateJWTToken } from './auth-utils.js';
import logger from '../../logger.js';

const EMAIL_REGEX_VALIDATION = /^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+$/i;
export interface LoginResponse {
  accessToken: string;
}

export type AuthRequest = Pick<User, 'email' | 'password'>;

export const registerController: RequestHandler<
  unknown,
  unknown,
  User
> = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: 'Empty email or passwords are not allowed' });
  }

  if (!EMAIL_REGEX_VALIDATION.test(email)) {
    return res.status(409).json({ msg: 'Invalid email' });
  }

  try {
    const existingUser = await UserModel.findOne({ email }).exec();
    if (existingUser !== null) {
      return res.status(409).json({ msg: 'User is already registered' });
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password: encryptPassword(password),
    };

    await UserModel.create(newUser);
    return res.status(201).json({ msg: 'New user successfully created!' });
  } catch {
    return res.status(500);
  }
};

export const loginUserController: RequestHandler<
  unknown,
  LoginResponse,
  AuthRequest
> = async (req, res) => {
  const { email, password } = req.body;
  try {
    const filterUser = {
      email,
      password: encryptPassword(password),
    };
    const existingUser = await UserModel.findOne(filterUser).exec();
    if (existingUser === null) {
      return res.status(404);
    }

    const tokenJWT = generateJWTToken(email);
    res.status(201).json({
      accessToken: tokenJWT,
    });
  } catch (err) {
    logger.error('Error logging in', err);
    res.status(500);
  }
};
