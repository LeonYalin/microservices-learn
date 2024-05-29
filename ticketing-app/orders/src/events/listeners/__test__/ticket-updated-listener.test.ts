import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { TicketUpdatedEvent } from '@leonyalintickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert202',
    price: 202,
    userId: 'sdfsdf',
  };

  // create a fake message object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { ticket, listener, data, msg };
};

it('finds, updates and saves the ticket', async () => {
  const { ticket, listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // white assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket).toBeDefined();
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it('acts the message', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data pbject + message object
  await listener.onMessage(data, msg);

  // white assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if event has a skipped version number', async () => {
  const { listener, ticket, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    expect(msg.ack).not.toHaveBeenCalled();
  }
});
