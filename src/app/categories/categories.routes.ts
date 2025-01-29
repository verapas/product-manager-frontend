import { Routes } from '@angular/router';
import {authGuard} from '../guards/auth.guard';


export const categoriesRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
  },
  {
    path: 'modify',
    loadComponent: () => import('./modify/modify.component').then(c => c.ModifyComponent),
    canActivate: [authGuard],
    data: { role: 'admin' },
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.component').then(c => c.CreateComponent),
    canActivate: [authGuard],
    data: { role: 'admin' },
  },
];
