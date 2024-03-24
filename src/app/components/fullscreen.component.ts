import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-fullscreen',
  standalone: true,
  imports: [],

  template: `
    <section
      class="h-full w-full min-h-96 fixed inset-0 grid place-content-center z-20 px-2 backdrop-blur-sm bg-zinc-900/40 animate-fade "
    >
      <img
        [src]="image"
        alt="image"
        srcset=""
        class="aspect-auto md:max-h-[30rem] md:max-w-4xl "
      />

      <button
        class="absolute top-2 right-2 bg-white p-2 rounded-lg"
        (click)="onCloseFullscreen()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5 fill-current text-gray-800"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </section>
  `,
})
export class FullscreenComponent {
  @Input() image: string | ArrayBuffer = '';
  @Input() state: boolean = false;

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    if (this.shouldHandleEscapeKey()) {
      this.onCloseFullscreen();
      event.stopImmediatePropagation(); // Prevents the event from reaching the parent component
    }
  }
  shouldHandleEscapeKey(): boolean {
    return this.state;
  }

  onCloseFullscreen() {
    this.close.emit(true);
  }
}
