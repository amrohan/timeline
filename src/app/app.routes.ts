import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
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
