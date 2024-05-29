import {
  ExpirationCompleteEvent,
  Subjects,
  Publisher,
} from '@leonyalintickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
