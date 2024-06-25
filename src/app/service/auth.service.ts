import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  authState,
  signInWithPopup,
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
    signInWithPopup(this.auth, this.provider)
      .then((u) => {
        console.log(u);
      })
      .catch((err) => console.log(err));
  }

  getUsrProfileInfo() {
    return this.auth.currentUser;
  }

  signOut() {
    this.auth.signOut();
  }
}
