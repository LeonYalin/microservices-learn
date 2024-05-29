import { Subjects, Publisher, OrderCancelledEvent } from '@leonyalintickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
