import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<any>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

export const tokenValidationInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('ACCESS_TOKEN');

  if (token) {
    if (isTokenExpired(token)) {
      // Token ist abgelaufen -> Benutzer ausloggen
      localStorage.removeItem('ACCESS_TOKEN');
      alert('Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.');
      router.navigate(['/auth/login']);
      return next(req);
    }
  }

  return next(req);
};
