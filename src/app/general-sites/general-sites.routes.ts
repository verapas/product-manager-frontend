import { Routes } from '@angular/router';
import {authGuard} from '../guards/auth.guard';

export const generalSitesRoutes: Routes = [

  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [authGuard],
  },
];
