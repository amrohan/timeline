import { DatePipe, NgClass } from '@angular/common';
import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { tweet } from '@model';
import { AuthService, DbService } from '@service';
import { FirebaseTimestampPipe } from '@pipe';
import { FullscreenComponent } from './components/fullscreen.component';
import { TimeLineCardComponent } from './components/timeLineCard.component';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    FullscreenComponent,
    RouterLink,
    FirebaseTimestampPipe,
    TimeLineCardComponent,
  ],
  template: `
    <section class="animate-fade animate-ease-in-out">
      <div class="h-20 flex items-center justify-between">
        <h1 class="text-[#f0f7ee] p-0 m-0">Timeline</h1>

        <div class="flex justify-end items-center gap-2">
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
              class="size-5"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </a>
          <button
            class="rounded-md bg-zinc-900 p-2"
            (click)="signOutDialouge()"
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
              class="size-5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      @for (item of db.tweet(); track $index) {
      <app-timeLineCard
        [timeLine]="item"
        (selectedImageIds)="selectedImageId = $event"
        (selectedImages)="selectedImage = $event"
      />
      <!-- End Timeline -->
      }@empty {
      <div class="grid place-content-center h-[80%] w-svh">
        <img
          src="assets/cato.png"
          alt="cat image"
          class="object-cover size-96"
        />
        <p class="text-center">No data to show add something...</p>
      </div>
      }
    </section>

    <!-- Fullscreen -->
    @if (selectedImageId !== '') {
    <app-fullscreen
      [image]="selectedImage"
      (close)="selectedImageId = ''"
    ></app-fullscreen>
    }
  `,
})
export class TimelineComponent implements OnInit {
  public db = inject(DbService);
  auth = inject(AuthService);
  private router = inject(Router);

  selectedImage: string | ArrayBuffer = '';
  selectedImageId = '';

  // injections

  ngOnInit(): void {
    this.db.getTimeline(10).subscribe((data) => {
      this.db.tweet.set(data);
    });
  }

  signOutDialouge() {
    let text = 'Are you sure you want to logout?';
    if (confirm(text) == true) {
      this.auth.signOut();
      this.router.navigateByUrl('/login');
    } else {
      text = 'You canceled!';
    }
  }
}
