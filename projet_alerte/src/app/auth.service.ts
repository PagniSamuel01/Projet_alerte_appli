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

  /**
   * Connecte l'utilisateur en appelant le serveur backend
   */
  login(email: string, password: string) {
    return this.http.post<any>('http://192.168.1.189:8080/users/login', {
      mail: email,
      motdepasse: password
    }).pipe(
      // On peut ajouter de la logique ici si besoin, comme stocker le token
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
  envoyerconfirmation(mail:string){
    return this.http.post('http://192.168.1.189:8080/users/registrer',mail); 
  
  }
}
