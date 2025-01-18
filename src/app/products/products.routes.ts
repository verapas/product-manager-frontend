import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: 'list',
    loadComponent: () => import('./list/list.component').then(c => c.ListComponent),
  },
  {
    path: 'modify',
    loadComponent: () => import('./modify/modify.component').then(c => c.ModifyComponent),
  },
];
