import request from 'supertest';
import { app } from '../../app';

it('responds with the details about current user', async () => {
  // we are not using .get('/api/users/signup') here because we want to retain the cookie between calls.
  // This is happening automatically in browser, but not in jest.
  const cookie = await signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .expect(200);
  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').expect(200);
  expect(response.body.currentUser).toEqual(null);
});
