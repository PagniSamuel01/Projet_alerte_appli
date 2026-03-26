import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Clé utilisée pour stocker le jeton d'authentification dans le navigateur
  private readonly AUTH_KEY = 'auth_token';
  
  // Utilisation d'un signal pour gérer l'état d'authentification de manière réactive
  private authenticated = signal<boolean>(this.checkInitialAuth());

  constructor(private http: HttpClient) {}

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

  private readonly API_URL = 'http://192.168.1.189:8080/auth';

  /**
   * Connecte l'utilisateur en appelant le serveur backend
   */
  login(email: string, password: string) {
    return this.http.post<any>(`${this.API_URL}/login`, {
      mail: email,
      motdepasse: password
    }).pipe(
      tap((user: any) => {
        if (user) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(this.AUTH_KEY, 'token_' + user.id);
          }
          this.authenticated.set(true);
        }
      })
    );
  }

  /**
   * Demande un lien de réinitialisation par email
   */
  requestPasswordReset(email: string) {
    return this.http.post(`${this.API_URL}/forgot-password`, { email });
  }

  /**
   * Réinitialise le mot de passe avec le token
   */
  confirmPasswordReset(token: string, newPassword: string) {
    return this.http.post(`${this.API_URL}/reset-password`, { token, newPassword });
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

  envoyerconfirmation(mail:string){
    return this.http.post('http://192.168.1.189:8080/users/registrer', mail); 
  }
}
