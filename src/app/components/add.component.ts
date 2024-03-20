import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FullscreenComponent } from './fullscreen.component';
import { tweet } from '@model';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [RouterLink, FormsModule, FullscreenComponent],
  template: `
    <section
      class="h-full z-full z-10 fixed inset-0 backdrop-blur-sm bg-zinc-900/40"
    >
      <main class="h-full w-full flex justify-center items-center py-4 px-2">
        <div
          class="bg-black !text-slate-100 max-w-4xl  w-full h-full p-4 rounded-md border border-zinc-800"
        >
          <div class="flex justify-between items-center gap-2 h-16">
            <h1 class="text-2xl font-semibold ">Timeline</h1>
            <a routerLink="/" class="rounded-lg bg-zinc-900 p-2">
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
                class="size-5"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </a>
          </div>

          <!-- title desc and date -->
          <div class="mt-2">
            <label for="title" class=" uppercase text-xs">Title</label>
            <input
              type="text"
              id="title"
              class="w-full rounded-md bg-zinc-900 p-2"
              [(ngModel)]="timeline.title"
            />
          </div>
          <div class="mt-2">
            <label for="desc" class="uppercase text-xs">Description</label>
            <textarea
              id="desc"
              class="w-full rounded-md bg-zinc-900 p-2 resize-none"
              [(ngModel)]="timeline.description"
            ></textarea>
          </div>
          <div class="">
            <label
              for="date"
              class="uppercase text-xs placeholder:text-gray-300"
              >Date</label
            >
            <input
              type="date"
              id="date"
              class="w-full rounded-md bg-zinc-900 p-2"
              [(ngModel)]="timeline.date"
            />
          </div>
          <div class="flex flex-col items-center justify-center w-full mt-3">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-full h-fit  rounded-lg cursor-pointer bg-zinc-900"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                class="hidden"
                [(ngModel)]="timeline.image"
                (change)="onFileChange($event)"
                accept="image/*"
              />
            </label>
            @if (imageSrc) {
            <div
              class="size-28 flex justify-between items-center mt-2 rounded-md relative overflow-hidden bg-zinc-900"
            >
              <img
                (click)="showFullscreen = true"
                [src]="imageSrc"
                alt="image"
                class="rounded-md cover"
              />
              <button (click)="removeFile()">
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
                  class="size-5 bg-red-700 rounded-full  z-20 absolute top-1 right-1"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8" />
                </svg>
              </button>
            </div>
            }
          </div>

          <!-- Add btn -->
          <div class="flex justify-center mt-4">
            <button
              class="rounded-md  p-2 w-full bg-white text-black"
              (click)="onAdd()"
            >
              Add
            </button>
          </div>
        </div>
      </main>
    </section>

    <!-- Fullscreen -->

    @if(showFullscreen){
    <app-fullscreen
      [image]="imageSrc"
      (close)="showFullscreen = false"
    ></app-fullscreen>
    }
  `,
})
export class AddComponent {
  timeline: tweet = {
    id: '',
    title: '',
    description: '',
    date: new Date(),
    image: '',
  };

  imageSrc: string | ArrayBuffer = '';
  showFullscreen = false;

  onAdd() {
    // TODO
    console.log('🚀 ~ AddComponent ~ onAdd ~ this.timeline:', this.timeline);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removeFile() {
    this.imageSrc = '';
    this.timeline.image = '';
  }
}
