import { Message } from 'node-nats-streaming';
import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
} from '@leonyalintickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findOne({ _id: id, version: version - 1 });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    msg.ack();
  }
}
