import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { tweet } from '@model';

import { NgStyle, formatDate } from '@angular/common';
import { Timestamp } from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
} from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { DbService } from '@service';
import { generateUniqueFilename } from '@helpers';
import { FullscreenComponent } from './fullscreen.component';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [FormsModule, RouterLink, NgStyle, FullscreenComponent],

  template: `
    <section
      class="h-full z-full z-10 fixed inset-0 backdrop-blur-sm bg-zinc-900/40"
    >
      <main class="h-full w-full flex justify-center items-center py-4 px-2">
        <div
          class="bg-black !text-slate-100 max-w-4xl w-full h-fit p-4 rounded-md border border-zinc-800 animate-fade-up animate-ease-in-out"
        >
          <div class="flex justify-between items-center gap-2 ">
            <h2 class="m-0">Update Timeline</h2>
            <a routerLink="/" class="rounded-lg bg-zinc-900 p-1.5 m-0">
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
              [(ngModel)]="selectedDate"
            />
          </div>
          <div class="flex flex-col items-center justify-center w-full mt-3">
            @if (!imageSrc &&!oldImage) {
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
            } @if (imageSrc) {
            <div
              class="size-28 flex justify-between items-center mt-2 rounded-md relative overflow-hidden bg-zinc-900"
            >
              <img
                (click)="showFullscreen = true"
                [src]="imageSrc"
                alt="image"
                class="rounded-md object-cover object-fit w-full h-full"
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
              @if(progress() !== 100 ) {
              <div
                role="status"
                class="absolute grid place-content-center bg-black/60 h-full w-full"
              >
                <svg
                  aria-hidden="true"
                  class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
              }
            </div>
            @if(progress() !== 100 ) {
            <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-2">
              <div
                class="bg-gray-300 text-xs font-medium text-black text-center p-0.5 leading-none rounded-full"
                [ngStyle]="{ width: progress() + '%' }"
              >
                @if(progress() ===100) { Uploaded }@else { {{ progress() }}% }
              </div>
            </div>
            } }
          </div>

          <!-- Add btn -->
          <div class="flex justify-between items-center gap-2 mt-4">
            <button
              class="rounded-md  p-2 w-full bg-white text-black"
              (click)="onUpdate()"
            >
              Update
            </button>
            <button
              class="rounded-md  p-2 w-full bg-red-500 text-white"
              (click)="onDelete()"
            >
              Delete
            </button>
          </div>
        </div>
      </main>
    </section>

    @if(showFullscreen){
    <app-fullscreen
      [image]="imageSrc"
      [state]="showFullscreen"
      (close)="showFullscreen = false"
    ></app-fullscreen>
    }
  `,
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
  progress = signal(100);

  oldImage: string | ArrayBuffer = '';
  imageSrc: string | ArrayBuffer = '';
  showFullscreen = false;

  private readonly db = inject(DbService);
  private readonly storage: Storage = inject(Storage);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastrService);

  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.db.getTimeLineById(this.route.snapshot.params['id']).subscribe({
      next: (res) => {
        this.timeline = res;
        this.imageSrc = res.image;
        this.oldImage = res.image;
        // convert firebase time stamp to date
        if (res.date instanceof Timestamp) {
          this.selectedDate = formatDate(
            res.date.toDate(),
            'yyyy-MM-dd',
            'en-US'
          );
        }
      },
      error(err) {},
    });
  }

  onUpdate() {
    this.updateTimeline();
  }

  updateTimeline() {
    const jsDate = new Date(this.selectedDate);
    const firebaseTimestamp: Timestamp = Timestamp.fromDate(jsDate);
    this.timeline.date = firebaseTimestamp;

    this.db
      .updateTimeline(this.route.snapshot.params['id'], this.timeline)
      .subscribe({
        next: (res) => {
          this.toast.success('Timeline updated successfully');
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.toast.error('Unable to update timeline');
        },
      });
  }

  uploadFile() {
    const fileName = generateUniqueFilename();
    const storageRef = this.getStorageRef(fileName);
    const uploadTask = this.createUploadTask(storageRef, this.fileData);

    this.handleUploadState(uploadTask);
  }

  getStorageRef(fileName: string) {
    return ref(this.storage, fileName);
  }

  createUploadTask(storageRef: StorageReference, fileData: File) {
    return uploadBytesResumable(storageRef, fileData);
  }

  handleUploadState(uploadTask: UploadTask) {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.handleSnapshot(snapshot);
      },
      (error) => console.log(error),
      () => this.handleCompletion(uploadTask)
    );
  }

  handleSnapshot(snapshot: UploadTaskSnapshot) {
    let prog = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    this.progress.set(prog);
    this.cdr.detectChanges();
  }

  handleCompletion(uploadTask: UploadTask) {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      this.timeline.image = downloadURL;
    });
  }

  onDelete() {
    if (typeof this.timeline.image === 'string') {
      const regex = /.*\/([^?]+)\?.*/;
      const img = this.timeline.image.replace(regex, '$1');
      this.removeFileFromStorage(img);
    }

    this.db.deleteTimeline(this.route.snapshot.params['id']).subscribe({
      next: (res) => {
        this.toast.success('Item deleted');
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.toast.error(err.message, 'Error');
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
    this.uploadFile();
  }

  removeFile() {
    const regex = /.*\/([^?]+)\?.*/;

    if (typeof this.timeline.image === 'string') {
      // Use the first capturing group to replace the entire match with the filename
      const img = this.timeline.image.replace(regex, '$1');
      this.removeFileFromStorage(img);
    }

    this.timeline.image = '';
    this.imageSrc = '';
    this.oldImage = '';
  }

  removeFileFromStorage(fileName: string) {
    const storageRef = ref(this.storage, fileName);
    deleteObject(storageRef)
      .then(() => {
        this.oldImage = '';
      })
      .catch((err) => {
        this.toast.error(err.message, 'Error');
      });
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKeydownHandler(event: KeyboardEvent) {
    if (this.shouldHandleEscapeKey()) {
      this.router.navigateByUrl('/');
      event.stopImmediatePropagation(); // Prevents the event from reaching the child component
    }
  }
  shouldHandleEscapeKey(): boolean {
    return !this.showFullscreen;
  }
}
