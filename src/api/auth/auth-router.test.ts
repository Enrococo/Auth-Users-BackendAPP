import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../../database/connection.js';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app.js';
import { AuthRequest } from './auth-controllers';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUrl = mongoServer.getUri();
  await connectDB(mongoUrl);
});
afterAll(() => {
  mongoServer.stop();
  mongoose.connection.close();
});

describe('Given an authRouter from an app', () => {
  describe('When a user wats to register with a valid mail and password', () => {
    test('Then it should be registered', async () => {
      const user: AuthRequest = {
        email: 'enroco@mock.com',
        password: 'password_mock',
      };
      await request(app).post('/auth/register').send(user).expect(201);
    });
  });

  describe('When a user wants to register with an invalid email', () => {
    test('Then it should not be registered', async () => {
      const invalidUser: AuthRequest = {
        email: 'mock@',
        password: 'possword_mocka',
      };
      const response = await request(app)
        .post('/auth/register')
        .send(invalidUser)
        .expect(409);

      expect(response.body).toEqual({ msg: 'Invalid email' });
    });
  });
});
