import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

/**
 * Überprüft, ob das JWT-Token abgelaufen ist.
 * Gibt `true` zurück, wenn das Token ungültig oder abgelaufen ist.
 */
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<any>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Interceptor prüft bei jeder Anfrage, ob das Token abgelaufen ist.
 * Falls das Token abgelaufen ist, wird der Benutzer zur Login-Seite weitergeleitet.
 */
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
