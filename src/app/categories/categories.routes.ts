import { Routes } from '@angular/router';
import {authGuard} from '../guards/auth.guard';


export const categoriesRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
  },
  {
    path: 'create',
    loadComponent: () => import('./modify/modify.component').then(c => c.ModifyComponent),
    canActivate: [authGuard],
    data: { role: 'admin' },
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./modify/modify.component').then(c => c.ModifyComponent),
    canActivate: [authGuard],
    data: { role: 'admin' },
  },
];
