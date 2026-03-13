# Documentation Technique : Système d'Authentification (Projet Alerte)

Ce document contient l'intégralité du code source commenté mis en place pour sécuriser votre application d'alerte. Il sert de guide de référence pour comprendre le fonctionnement du système de connexion et de récupération de mot de passe.

---

## 1. Le Service d'Authentification (`src/app/auth.service.ts`)
**Rôle** : Gère l'état de la session (connecté/déconnecté), le stockage dans le navigateur et la logique métier de l'authentification.

```typescript
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
```

---

## 2. La Garde de Sécurité (`src/app/auth.guard.ts`)
**Rôle** : Intercepte les accès aux routes protégées (comme `/form`) et redirige vers le login si besoin.

```typescript
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
```

---

## 3. La Configuration des Routes (`src/app/app.routes.ts`)
**Rôle** : Définit la structure URL de l'application et les règles d'accès.

```typescript
import { Routes } from '@angular/router';
import { PageAuthentificationComponent } from './page-authentification/page-authentification.component';
import { InterfaceAlerteComponent } from './interface-alerte/interface-alerte.component';
import { authGuard } from './auth.guard';

/**
 * Configuration des chemins (routes) de l'application
 */
export const routes: Routes = [
  // Page de connexion
  { path: 'login', component: PageAuthentificationComponent },
  
  // Page du formulaire d'alerte (protégée par authGuard)
  { 
    path: 'form', 
    component: InterfaceAlerteComponent,
    canActivate: [authGuard]
  },
  
  // Redirection par défaut (si l'adresse est vide, on va au login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Redirection si l'adresse n'existe pas
  { path: '**', redirectTo: 'login' }
];
```

---

## 4. Le Composant d'Authentification

### A. Logique TypeScript (`src/app/page-authentification/page-authentification.component.ts`)

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-page-authentification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './page-authentification.component.html',
  styleUrl: './page-authentification.component.scss'
})
export class PageAuthentificationComponent implements OnInit {
  // Le groupe de contrôle du formulaire
  authForm: FormGroup;
  
  // Indique si on est en mode "Mot de passe oublié"
  isForgotPasswordMode = false;
  
  // Indique si une action est en cours (chargement)
  isLoading = false; 
  
  // Messages pour le retour utilisateur (erreurs ou succès)
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialisation du formulaire avec des validateurs stricts
    this.authForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    }); 
  }

  ngOnInit() {}

  /**
   * Revient au formulaire de connexion classique
   */
  backToLogin() {
    this.isForgotPasswordMode = false;
    this.errorMessage = '';
    this.successMessage = '';
    this.authForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.authForm.get('password')?.updateValueAndValidity();
  }

  /**
   * Bascule l'interface pour la récupération de mot de passe
   */
  switchToForgotPassword() {
    this.isForgotPasswordMode = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.authForm.get('password')?.clearValidators();
    this.authForm.get('password')?.updateValueAndValidity();
  }

  /**
   * Gère l'envoi du formulaire
   */
  onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      const { email, password } = this.authForm.value;
      
      if (this.isForgotPasswordMode) {
        const success = this.authService.resetPassword(email);
        this.isLoading = false;
        if (success) {
          this.successMessage = 'Un email de réinitialisation a été envoyé.';
          setTimeout(() => { this.backToLogin(); }, 2000);
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'envoi.';
        }
        return;
      }

      const success = this.authService.login(email, password);
      this.isLoading = false;
      
      if (success) {
        this.router.navigate(['/form']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    }, 1000);
  }
}
```

### B. Interface HTML (`src/app/page-authentification/page-authentification.component.html`)

```html
<!-- Conteneur principal centré -->
<div class="auth-wrapper">
  
  <!-- Carte d'authentification blanche -->
  <div class="auth-card">
    
    <!-- En-tête : Titre et Sous-titre dynamiques -->
    <div class="auth-header">
      <h1 class="auth-title">
        {{ isForgotPasswordMode ? 'Récupération' : 'Salut!' }}
      </h1>
      <p class="auth-subtitle">
        {{ isForgotPasswordMode ? 'Entrez votre email pour réinitialiser votre mot de passe' : 'Entrez vos identifiants pour continuer' }}
      </p>
    </div>

    <!-- Formulaire lié au FormGroup dans le TypeScript -->
    <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="auth-form">

      <!-- Champ Email (Toujours visible) -->
      <div class="form-group">
        <label for="email">Adresse email</label>
        <div class="input-wrapper">
          <input id="email" type="email" formControlName="email" placeholder="nom@exemple.com"
            [class.invalid]="authForm.get('email')?.invalid && authForm.get('email')?.touched">
        </div>
      </div>

      <!-- Champ Mot de passe (Masqué si on récupère le compte) -->
      <div class="form-group" *ngIf="!isForgotPasswordMode">
        <div class="label-row">
          <label for="password">Mot de passe</label>
          <a (click)="switchToForgotPassword()" class="forgot-link">Oublié ?</a>
        </div>
        <div class="input-wrapper">
          <input id="password" type="password" formControlName="password" placeholder="••••••••"
            [class.invalid]="authForm.get('password')?.invalid && authForm.get('password')?.touched">
        </div>
      </div>

      <!-- Messages d'info -->
      <div class="error-banner" *ngIf="errorMessage">{{ errorMessage }}</div>
      <div class="success-banner" *ngIf="successMessage">{{ successMessage }}</div>

      <!-- Validation -->
      <button type="submit" class="auth-button" [disabled]="authForm.invalid || isLoading"> 
        <span *ngIf="!isLoading">{{ isForgotPasswordMode ? 'Envoyer le mail' : 'Se connecter' }}</span>
        <div class="spinner" *ngIf="isLoading"></div>
      </button>

      <div class="auth-footer" *ngIf="isForgotPasswordMode">
        <button type="button" class="toggle-button" (click)="backToLogin()">Retour à la connexion</button>
      </div>
    </form>
  </div>
</div>
```

---
*Ce document a été généré le 13 Mars 2026 pour documenter la sécurisation du Projet Alerte.*
