import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/app/tickets/${id}`).send().expect(404);
});

it('returns 200 if the ticket is found', async () => {
  const title = 'Concert';
  const price = 20;

  const respose = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price })
    .expect(201);

  const ticketResponce = await request(app)
    .get(`/api/tickets/${respose.body.id}`)
    .set('Cookie', global.signin())
    .expect(200);

  expect(ticketResponce.body.title).toEqual(title);
  expect(ticketResponce.body.price).toEqual(price);
});
