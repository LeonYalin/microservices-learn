import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = '1234';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.forEach((coll) => coll.deleteMany({}));
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = async () => {
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
  const cookie = authResponse.get('Set-Cookie');
  return cookie;
};
