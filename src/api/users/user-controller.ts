import { RequestHandler } from 'express';
import { UserLocalsAuthInfo } from '../auth/auth-types.js';
import { User, UserModel } from './user-schema.js';

export const getUsersController: RequestHandler<
  unknown,
  unknown,
  Omit<User, 'password'>,
  UserLocalsAuthInfo
> = async (req, res) => {
  const users = await UserModel.find({});
  if (users !== null) {
    return res.json(users);
  }
};

export const getUserByIdController: RequestHandler<
  User,
  Omit<User, 'password'>,
  User,
  UserLocalsAuthInfo
> = async (req, res) => {
  const { id } = req.params;
  const user = await UserModel.findById(id, { __v: 0, password: 0 }).populate(
    'follower',
  );
  if (user !== null) {
    return res.json(user);
  }

  res.sendStatus(404);
};

export const createUserController: RequestHandler<
  unknown,
  User,
  User,
  unknown
> = async (req, res) => {
  const user = req.body;
  await UserModel.create(user);
  res.status(201).json(user);
};

export const addFollowertoUser: RequestHandler<
  { id: string; idFollower: string },
  never,
  never,
  never,
  UserLocalsAuthInfo
> = async (req, res) => {
  const { id, idFollower } = req.params;
  const resDb = await UserModel.updateOne(
    { _id: id },
    { $push: { follower: idFollower } },
  ).exec();
  if (resDb.matchedCount === 0) {
    return res.sendStatus(404);
  }

  if (resDb.modifiedCount === 1) {
    return res.sendStatus(204);
  }

  res.sendStatus(500);
};
