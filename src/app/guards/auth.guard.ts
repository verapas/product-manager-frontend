import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  exp: number;
  roles?: string[];
}

/**
 * @function authGuard
 * @description Überprüft, ob der Benutzer authentifiziert ist und ggf. Adminrechte hat.
 * Falls das Token abgelaufen oder nicht vorhanden ist, wird zur Login-Seite weitergeleitet.
 * Falls ein Admin-Bereich betreten wird, wird geprüft, ob der Benutzer Adminrechte hat.
 * @param route Die aktuelle Route, die aufgerufen wird.
 * @param state Der aktuelle RouterStateSnapshot.
 * @returns `true`, wenn der Benutzer Zugriff hat, sonst `false` (Umleitung zur entsprechenden Seite).
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('ACCESS_TOKEN');

  // Dashboard ist für alle zugänglich, unabhängig vom Login-Status
  if (state.url === '/dashboard') {
    return true;
  }

  // Falls kein Token vorhanden ist, Umleitung zur Login-Seite
  if (!token) {
    console.warn('Kein Token gefunden, Umleitung zur Login-Seite.');
    router.navigate(['/auth/login']);
    return false;
  }

  try {
    const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Falls das Token abgelaufen ist, Benutzer ausloggen und zur Login-Seite umleiten
    if (decoded.exp < currentTime) {
      console.warn('Token abgelaufen, Umleitung zur Login-Seite.');
      localStorage.removeItem('ACCESS_TOKEN');
      router.navigate(['/auth/login']);
      return false;
    }

    // Prüfen, ob der Benutzer Adminrechte hat
    const isAdmin = decoded.roles?.includes('admin');

    // Falls Admin-Bereich betreten wird, aber keine Adminrechte vorhanden sind, umleiten
    if (route.data?.['role'] === 'admin' && !isAdmin) {
      console.warn('Keine Admin-Berechtigung.');

      if (state.url.startsWith('/products')) {
        router.navigate(['/products/list']);
      } else if (state.url.startsWith('/categories')) {
        router.navigate(['/categories/list']);
      } else {
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
