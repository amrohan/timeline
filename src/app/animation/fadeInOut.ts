import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('0.4s ease-out', style({ opacity: 1 })),
  ]),
  transition(':leave', [animate('0.4s ease-in', style({ opacity: 0 }))]),
]);
