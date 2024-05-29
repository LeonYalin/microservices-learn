import { Publisher, OrderCreatedEvent, Subjects } from '@leonyalintickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
