import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  authState,
  signInWithRedirect,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  provider = new GoogleAuthProvider();

  signInWithProvider() {
    signInWithRedirect(this.auth, this.provider);
  }

  signOut() {
    this.auth.signOut();
  }
}
