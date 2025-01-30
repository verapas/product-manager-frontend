import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  exp: number;
  roles: string[];
}

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('ACCESS_TOKEN');

  if (!token) {
    console.warn('Kein Token gefunden, Umleitung zur Login-Seite.');
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      console.warn('Token abgelaufen, Umleitung zur Login-Seite.');
      localStorage.removeItem('ACCESS_TOKEN');
      router.navigate(['/auth/login']);
      return false;
    }

    const isAdmin = decoded.roles?.includes('admin');

    if (route.data?.['role'] === 'admin' && !isAdmin) {
      console.warn('Keine Admin-Berechtigung.');

      // Weiterleitung je nach Bereich
      if (state.url.startsWith('/products')) {
        console.warn('Umleitung zur Produktliste.');
        router.navigate(['/products/list']);
      } else if (state.url.startsWith('/categories')) {
        console.warn('Umleitung zur Kategorieliste.');
        router.navigate(['/categories/list']);
      } else {
        console.warn('Umleitung zur Startseite.');
        router.navigate(['/']);
      }

      return false;
    }

    return true;
  } catch (error) {
    console.error('Fehler beim Dekodieren des Tokens:', error);
    localStorage.removeItem('ACCESS_TOKEN');
    router.navigate(['/auth/login']);
    return false;
  }
};
