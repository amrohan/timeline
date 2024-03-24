import { DatePipe } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { tweet } from '@model';
import { FirebaseTimestampPipe } from '@pipe';
import { DbService } from '@service';

@Component({
  selector: 'app-timeLineCard',
  standalone: true,
  imports: [FirebaseTimestampPipe, DatePipe, RouterLink],
  template: `
    <!-- Timeline -->
    <div
      class="mx-none md:mx-auto max-w-4xl animate-fade-up animate-ease-in-out"
    >
      <!-- Heading -->
      <div class="ps-2 my-1 first:mt-0 flex justify-between items-center">
        <h3 class="text-xs font-medium uppercase text-gray-300">
          {{ timeLine().date | firebaseTimestamp | date }}
        </h3>
      </div>
      <!-- End Heading -->

      <!-- Item -->
      <div class="flex gap-x-3">
        <!-- Icon -->
        <div
          class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-500"
        >
          <div class="relative z-10 size-7 flex justify-center items-center">
            <div class="size-2 rounded-full bg-gray-500"></div>
          </div>
        </div>
        <!-- End Icon -->

        <!-- Right Content -->
        <div class="grow pt-0.5 pb-8">
          <h3
            routerLink="/edit/{{ timeLine().id }}"
            class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white"
          >
            {{ timeLine().title }}
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ timeLine().description }}
          </p>
          <!-- Image -->
          <div class="aspect-video max-w-xl bg-zinc-800 rounded-md">
            <img
              class="object-cover"
              (click)="onFullScreenClick(timeLine().id!, timeLine().image)"
              [src]="timeLine().image"
              [alt]="timeLine().title"
            />
          </div>
        </div>
        <!-- End Right Content -->
      </div>
      <!-- End Item -->

      <!-- Item -->
      @if (timeLine().id === db.tweet()[db.tweet().length-1].id){

      <div class="ps-[7px] flex gap-x-3">
        <button
          type="button"
          (click)="LoadMore()"
          class="hs-collapse-toggle hs-collapse-open:hidden text-start inline-flex items-center gap-x-1 text-sm text-gray-300 font-medium decoration-2 hover:underline "
          id="hs-timeline-collapse-content"
          data-hs-collapse="#hs-timeline-collapse"
        >
          <svg
            class="flex-shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
          {{ isEmpty ? 'No more data' : 'Load More' }}
        </button>
      </div>
      }
      <!-- End Item -->
    </div>
  `,
})
export class TimeLineCardComponent {
  //   timeLine = inputsignal<tweet>({} as tweet);
  timeLine = input.required<tweet>();
  selectedImageIds = output<string>();
  selectedImages = output<string | ArrayBuffer>();
  isEmpty = false;
  selectedImageId = '';
  selectedImage: string | ArrayBuffer = '';
  public db = inject(DbService);

  LoadMore() {
    const lastTweet: tweet = this.db.tweet()[this.db.tweet().length - 1];

    this.db.loadMore(lastTweet).subscribe({
      next: (res) => {
        if (res.length === 0) {
          this.isEmpty = true;
        }
        this.db.tweet.set([...this.db.tweet(), ...res]);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onFullScreenClick(id: string, image: string | ArrayBuffer) {
    if (this.selectedImageId === id) {
      this.selectedImageIds.emit('');
    } else {
      this.selectedImageIds.emit(id);
      this.selectedImages.emit(image);
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    this.selectedImageId = '';
    this.selectedImageIds.emit('');
  }
}
