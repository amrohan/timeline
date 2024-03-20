import { DatePipe, NgClass } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { FullscreenComponent } from './components/fullscreen.component';
import { RouterLink } from '@angular/router';
import { tweet } from '@model';
import { DbService } from './service/db.service';
import { FirebaseTimestampPipe } from './pipe/firebaseTimestamp.pipe';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    FullscreenComponent,
    RouterLink,
    FirebaseTimestampPipe,
  ],
  template: `
    <div class="h-20 flex items-center justify-between">
      <h1 class="text-[#f0f7ee] p-0 m-0">Our Timeline</h1>
      <a routerLink="/add" class="rounded-md bg-zinc-900 p-2">
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
          class="lucide lucide-plus"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </a>
    </div>

    @for (item of tweet; track $index) {

    <!-- Timeline -->
    <div class="mx-none md:mx-auto max-w-4xl">
      <!-- Heading -->
      <div class="ps-2 my-2 first:mt-0">
        <h3
          class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400"
        >
          {{ item.date | date : 'dd MMMM yyyy' }}
        </h3>
      </div>
      <!-- End Heading -->

      <!-- Item -->
      <div class="flex gap-x-3">
        <!-- Icon -->
        <div
          class="relative last:after:hidden after:absolute after:top-7 after:bottom-0 after:start-3.5 after:w-px after:-translate-x-[0.5px] after:bg-gray-200 dark:after:bg-gray-700"
        >
          <div class="relative z-10 size-7 flex justify-center items-center">
            <div class="size-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
          </div>
        </div>
        <!-- End Icon -->

        <!-- Right Content -->
        <div class="grow pt-0.5 pb-8">
          <h3
            class="flex gap-x-1.5 font-semibold text-gray-800 dark:text-white"
          >
            {{ item.title }}
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ item.description }}
          </p>
          <!-- Image -->
          <div class="aspect-video max-w-xl bg-zinc-800 rounded-md">
            <img
              class="object-cover"
              (click)="onFullScreenClick(item.id!, item.image)"
              [src]="item.image"
              [alt]="item.title"
            />
          </div>
        </div>
        <!-- End Right Content -->
      </div>
      <!-- End Item -->

      <!-- Item -->
      @if (tweet.length-1 ==$index) {

      <div class="ps-[7px] flex gap-x-3">
        <button
          type="button"
          class="hs-collapse-toggle hs-collapse-open:hidden text-start inline-flex items-center gap-x-1 text-sm text-blue-600 font-medium decoration-2 hover:underline dark:text-blue-500 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
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
          Show older
        </button>
      </div>
      }

      <!-- End Item -->
    </div>
    <!-- End Timeline -->
    }

    <!-- Fullscreen -->
    @if (selectedImageId !== '') {
    <app-fullscreen
      [image]="selectedImage"
      (close)="selectedImageId = ''"
    ></app-fullscreen>
    }
  `,
})
export class TweetComponent implements OnInit {
  tweet: tweet[] = [
    {
      title: 'Boomer day went to the park',
      description: 'Finally! You can check it out here.',
      image:
        'https://images.unsplash.com/photo-1710814778753-245115460aa6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: new Date(),
    },
    {
      title: 'Went to the juhu beach',
      description: 'Had a great time with my love. You can check it out here.',
      image:
        'https://images.unsplash.com/photo-1682695794816-7b9da18ed470?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      date: new Date(),
    },
  ];

  // on image click make it full

  selectedImageId: string = '';
  selectedImage: string | ArrayBuffer = '';

  // injections

  private db = inject(DbService);

  ngOnInit(): void {
    this.db.getProject().subscribe((data) => {
      this.tweet = data;
    });
  }

  onFullScreenClick(id: string, image: string | ArrayBuffer) {
    if (this.selectedImageId === id) {
      this.selectedImageId = '';
    } else {
      this.selectedImageId = id;
      this.selectedImage = image;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    this.selectedImageId = '';
  }
}
