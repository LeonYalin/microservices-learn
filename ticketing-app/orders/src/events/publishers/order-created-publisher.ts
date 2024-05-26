import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from '@leonyalintickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
