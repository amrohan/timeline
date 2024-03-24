import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'timeline',
  },
  {
    path: 'timeline',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./timeline.component').then((m) => m.TimelineComponent),
  },
  {
    path: 'add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/add.component').then((m) => m.AddComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/edit.component').then((m) => m.EditComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login.component').then((m) => m.LoginComponent),
  },
];
