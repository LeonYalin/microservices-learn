import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { OrderCancelledEvent, OrderStatus } from '@leonyalintickets/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();
  // create and save the ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: 'sdfsd',
  });
  ticket.set({ orderId });
  await ticket.save();

  // create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('updated a ticket, publishes a ticket update event, and acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);
  expect(updatedTicket?.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
