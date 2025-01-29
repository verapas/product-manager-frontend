import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.routes').then(m => m.categoriesRoutes),
  },
  {
    path: 'general-sites',
    loadChildren: () => import('./general-sites/general-sites.routes').then(m => m.generalSitesRoutes),
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.routes').then(m => m.productsRoutes),
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.routes').then(m => m.usersRoutes),
  },
];
