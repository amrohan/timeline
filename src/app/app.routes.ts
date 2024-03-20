import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'add',
    loadComponent: () =>
      import('./components/add.component').then((m) => m.AddComponent),
  },
];
