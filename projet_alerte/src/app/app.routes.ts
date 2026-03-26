import { Routes } from '@angular/router';
import { PageAuthentificationComponent } from './page-authentification/page-authentification.component';
import { InterfaceAlerteComponent } from './interface-alerte/interface-alerte.component';
import { authGuard } from './auth.guard';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

/**
 * Configuration des chemins (routes) de l'application
 */
export const routes: Routes = [
  // Page de connexion
  { path: 'login', component: PageAuthentificationComponent },

  // Page de réinitialisation de mot de passe
  { path: 'reset-password', component: ResetPasswordComponent },
  
  // Page du formulaire d'alerte (protégée par authGuard)
  { 
    path: 'form', 
    component: InterfaceAlerteComponent,
    canActivate: [authGuard]
  },
  
  // Redirection par défaut (si l'adresse est vide, on va au login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Redirection si l'adresse n'existe pas
  { path: '**', redirectTo: 'login' },

  { path: '', component: InterfaceAlerteComponent }, // Affiche le composant à la racine (http://localhost:4200)
  { path: 'alerte', component: InterfaceAlerteComponent } // Affiche aussi sur /alerte
];