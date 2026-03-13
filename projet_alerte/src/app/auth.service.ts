import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Clé utilisée pour stocker le jeton d'authentification dans le navigateur
  private readonly AUTH_KEY = 'auth_token';
  
  // Utilisation d'un signal pour gérer l'état d'authentification de manière réactive
  private authenticated = signal<boolean>(this.checkInitialAuth());

  constructor() {}

  /**
   * Vérifie si l'utilisateur est déjà connecté au chargement de l'application
   */
  private checkInitialAuth(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem(this.AUTH_KEY);
    }
    return false;
  }

  /**
   * Retourne l'état actuel de l'authentification
   */
  isAuthenticated() {
    return this.authenticated();
  }

  /**
   * Simule une connexion utilisateur
   * @param email L'adresse email de l'utilisateur
   * @param password Le mot de passe (doit faire au moins 8 caractères)
   */
  login(email: string, password: string): boolean {
    // Logique simplifiée : on accepte si l'email existe et que le pass est assez long
    if (email && password.length >= 8) {
      if (typeof window !== 'undefined') {
        // Enregistrement d'un jeton fictif pour simuler la session
        localStorage.setItem(this.AUTH_KEY, 'mock_token_' + Date.now());
      }
      this.authenticated.set(true);
      return true;
    }
    return false;
  }

  /**
   * Déconnecte l'utilisateur en supprimant son jeton
   */
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.AUTH_KEY);
    }
    this.authenticated.set(false);
  }

  /**
   * Simule l'envoi d'un mail de réinitialisation de mot de passe
   */
  resetPassword(email: string): boolean {
    if (email) {
      console.log('Demande de réinitialisation envoyée pour :', email);
      return true;
    }
    return false;
  }
}
