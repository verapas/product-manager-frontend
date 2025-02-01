import { Routes } from '@angular/router';
import {authGuard} from '../guards/auth.guard';

export const usersRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
    canActivate: [authGuard],
    data: { role: 'admin' },
  }
];


