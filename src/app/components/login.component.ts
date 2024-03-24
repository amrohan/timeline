import { Component, OnInit, inject } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '@service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  template: `
    <div class="h-svh w-ful z-20 relative overflow-hidden">
      <div class="flex flex-col items-center justify-center h-full z-30">
        <h1 class="mb-0">Account Login</h1>
        <p class="mb-2 mt-1 text-center">Welcome to the TimeLine</p>
        <button
          class="bg-white text-black px-4 py-2 mt-4 rounded-md flex justify-center items-center gap-2"
          (click)="signInWithProvider()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 326667 333333"
            shape-rendering="geometricPrecision"
            text-rendering="geometricPrecision"
            image-rendering="optimizeQuality"
            fill-rule="evenodd"
            clip-rule="evenodd"
            class="size-5"
          >
            <path
              d="M326667 170370c0-13704-1112-23704-3518-34074H166667v61851h91851c-1851 15371-11851 38519-34074 54074l-311 2071 49476 38329 3428 342c31481-29074 49630-71852 49630-122593m0 0z"
              fill="#4285f4"
            />
            <path
              d="M166667 333333c44999 0 82776-14815 110370-40370l-52593-40742c-14074 9815-32963 16667-57777 16667-44074 0-81481-29073-94816-69258l-1954 166-51447 39815-673 1870c27407 54444 83704 91852 148890 91852z"
              fill="#34a853"
            />
            <path
              d="M71851 199630c-3518-10370-5555-21482-5555-32963 0-11482 2036-22593 5370-32963l-93-2209-52091-40455-1704 811C6482 114444 1 139814 1 166666s6482 52221 17777 74814l54074-41851m0 0z"
              fill="#fbbc04"
            />
            <path
              d="M166667 64444c31296 0 52406 13519 64444 24816l47037-45926C249260 16482 211666 1 166667 1 101481 1 45185 37408 17777 91852l53889 41853c13520-40185 50927-69260 95001-69260m0 0z"
              fill="#ea4335"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  `,
  styles: `
  `,
})
export class LoginComponent implements OnInit {
  auth = inject(AuthService);
  router = inject(Router);

  ngOnInit(): void {
    this.auth.authState$.subscribe((aUser) => {
      if (aUser) {
        this.router.navigateByUrl('/');
      }
    });
  }

  signInWithProvider() {
    this.auth.signInWithProvider();
  }
  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl('/login');
  }
}
