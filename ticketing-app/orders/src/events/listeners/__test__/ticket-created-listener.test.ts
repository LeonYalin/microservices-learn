import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import { TicketCreatedEvent } from '@leonyalintickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of a listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves the ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // white assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acts the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data pbject + message object
  await listener.onMessage(data, msg);

  // white assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});
