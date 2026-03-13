import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Garde de sécurité (AuthGuard) : empêche l'accès aux pages protégées
 * si l'utilisateur n'est pas connecté.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est connecté, on autorise l'accès
  if (authService.isAuthenticated()) {
    return true;
  }

  // Sinon, on le redirige immédiatement vers la page de connexion
  return router.parseUrl('/login');
};
