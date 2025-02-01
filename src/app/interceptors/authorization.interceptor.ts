import { HttpInterceptorFn } from '@angular/common/http';

/**
 * @function authorizationInterceptor
 * @description Fügt den Authorization-Header mit dem Bearer-Token zu jedem HTTP-Request hinzu,
 * falls ein Token im LocalStorage vorhanden ist.
 * @param req Der ausgehende HTTP-Request
 * @param next Die nächste Handler-Funktion in der Interceptor-Pipeline
 * @returns Der modifizierte Request mit Authorization-Header oder der originale Request
 */
export const authorizationInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('ACCESS_TOKEN');

  // Falls ein Token existiert, klone den Request und setze den Authorization-Header
  const clonedRequest = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
    : req;

  return next(clonedRequest);
};

