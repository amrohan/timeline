import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { tweet } from '@model';
import { DbService } from '../service/db.service';

import { formatDate } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getMetadata,
  getDownloadURL,
  deleteObject,
} from '@angular/fire/storage';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: ` <section
    class="h-full z-full z-10 fixed inset-0 backdrop-blur-sm bg-zinc-900/40"
  >
    <main class="h-full w-full flex justify-center items-center py-4 px-2">
      <div
        class="bg-black !text-slate-100 max-w-4xl  w-full h-full p-4 rounded-md border border-zinc-800"
      >
        <div class="flex justify-between items-center gap-2 h-16">
          <h1 class="text-2xl font-semibold ">Update Timeline</h1>
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
          <label for="date" class="uppercase text-xs placeholder:text-gray-300"
            >Date</label
          >
          <input
            type="date"
            id="date"
            class="w-full rounded-md bg-zinc-900 p-2"
            [(ngModel)]="selectedDate"
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
            (click)="onUpdate()"
          >
            Update
          </button>
        </div>
      </div>
    </main>
  </section>`,
})
export class EditComponent implements OnInit {
  selectedDate: string;
  timeline: tweet = {
    title: '',
    description: '',
    date: new Date(),
    image: '',
  };

  fileData: File;

  imageSrc: string | ArrayBuffer = '';
  showFullscreen = false;

  private readonly db = inject(DbService);
  private readonly storage: Storage = inject(Storage);

  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.db.getTimeLineById(this.route.snapshot.params['id']).subscribe({
      next: (res) => {
        this.timeline = res;
        this.imageSrc = res.image;
        // convert firebase time stamp to date
        if (res.date instanceof Timestamp) {
          this.selectedDate = formatDate(
            res.date.toDate(),
            'yyyy-MM-dd',
            'en-US'
          );
        }

        console.log('🚀 ~ EditComponent ~ this.db.getTimeLineById ~ res:', res);
      },
      error(err) {
        console.log('🚀 ~ EditComponent ~ this.db.getTimeLineById ~ err:', err);
      },
    });
  }

  onUpdate() {
    // TODO
    if (this.fileData) {
      const storageRef = ref(this.storage, this.fileData.name);
      uploadBytesResumable(storageRef, this.fileData).then(() => {
        getDownloadURL(storageRef).then((i) => {
          this.timeline.image = i;
          this.updateTimeline();
        });
      });
    } else {
      this.updateTimeline();
    }
  }

  updateTimeline() {
    // converting date to firebase timestamp
    const jsDate = new Date(this.selectedDate);
    const firebaseTimestamp: Timestamp = Timestamp.fromDate(jsDate);
    this.timeline.date = firebaseTimestamp;

    this.db
      .updateTimeline(this.route.snapshot.params['id'], this.timeline)
      .subscribe({
        next: (res) => {
          console.log(
            '🚀 ~ EditComponent ~ this.db.updateTimeline ~ res:',
            res
          );
        },
        error: (err) => {
          console.log(
            '🚀 ~ EditComponent ~ this.db.updateTimeline ~ err:',
            err
          );
          return {};
        },
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.fileData = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  removeFile() {
    const regex = /.*\/([^?]+)\?.*/;

    if (typeof this.timeline.image === 'string') {
      // Use the first capturing group to replace the entire match with the filename
      this.timeline.image = this.timeline.image.replace(regex, '$1');
      this.removeFileFromStorage(this.timeline.image);
    }

    this.timeline.image = '';
    this.imageSrc = '';
  }

  removeFileFromStorage(fileName: string) {
    const storageRef = ref(this.storage, fileName);
    deleteObject(storageRef).then(() => {
      console.log('🚀 ~ EditComponent ~ removeFileFromStorage ~ Deleted');
    });
  }
}
