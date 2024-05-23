import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { cookie } from 'express-validator';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({ title: 'asdfsf', price: 20 })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({ title: 'asdfsf', price: 20 })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'lala',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdlfksdkf',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie) // we want the same user on the following request
    .send({
      title: 'lala',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1000,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'lala',
      price: -11,
    })
    .expect(400);
});

it('updates the ticket if the user provides valid inputs', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie) // we want the same user on the following request
    .send({
      title: 'lala',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'mama',
      price: 1000,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(ticketResponse.body.title).toEqual('mama');
  expect(ticketResponse.body.price).toEqual(1000);
});

it('publishes an event', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie) // we want the same user on the following request
    .send({
      title: 'lala',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'mama',
      price: 1000,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
