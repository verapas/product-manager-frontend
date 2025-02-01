import { Routes } from '@angular/router';

export const generalSitesRoutes: Routes = [

  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
  },
];
