import { Routes } from '@angular/router';

export const generalSitesRoutes: Routes = [
  {
    path: 'impress',
    loadComponent: () => import('./impress/impress.component').then(c => c.ImpressComponent),
  },
  {
    path: 'data-privacy',
    loadComponent: () => import('./data-privacy/data-privacy.component').then(c => c.DataPrivacyComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./contact/contact.component').then(c => c.ContactComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
  },
];
