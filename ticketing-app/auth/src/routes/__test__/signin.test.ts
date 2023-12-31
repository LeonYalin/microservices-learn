import request from 'supertest';
import { app } from '../../app';

it('fails when a supplied email does not exist', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(400);
});

it('fails when a incorrect password is provided', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  return request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'asdf' })
    .expect(400);
});

it('response with a cookie whtn providing valid credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(200);
  expect(response.get('Set-Cookie')).toBeDefined();
});
