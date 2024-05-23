import {
  TicketCreatedEvent,
  Subjects,
  Publisher,
} from '@leonyalintickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  // queueGroupName = 'payments-service';
}
