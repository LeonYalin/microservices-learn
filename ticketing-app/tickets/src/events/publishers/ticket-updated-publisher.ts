import {
  TicketUpdatedEvent,
  Subjects,
  Publisher,
} from '@leonyalintickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
