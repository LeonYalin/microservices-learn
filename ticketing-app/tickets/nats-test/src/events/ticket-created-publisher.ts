import { TicketCreatedEvent } from '@leonyalintickets/common';
import { Subjects } from '@leonyalintickets/common';
import { Publisher } from '@leonyalintickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  // queueGroupName = 'payments-service';
}
