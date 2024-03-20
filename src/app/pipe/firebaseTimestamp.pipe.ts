import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firebaseTimestamp',
  standalone: true,
})
export class FirebaseTimestampPipe implements PipeTransform {
  transform(
    value: { seconds: number; nanoseconds: number },
    ...args: unknown[]
  ): Date {
    return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
  }
}
