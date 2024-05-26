import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from '@leonyalintickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
