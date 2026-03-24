import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserService } from '../services/user.service';

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
    private userService: UserService,
    private router: Router
  ) {
    // Initialisation du formulaire avec des validateurs stricts
    this.authForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email, 
        Validators.pattern(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/)
      ]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    }); 
  }

  ngOnInit() {
    // Méthode de cycle de vie appelée à l'initialisation du composant
  }

  /**
   * Revient au formulaire de connexion classique
   */
  backToLogin() {
    this.isForgotPasswordMode = false;
    this.errorMessage = '';
    this.successMessage = '';
    
    // On restaure les règles du mot de passe
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
    // En mode récupération, le mot de passe n'est pas nécessaire
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

    // Simulation d'une attente réseau (1 seconde)
    setTimeout(() => {
      const { email, password } = this.authForm.value;
      
      // CAS 1 : Mode récupération de mot de passe
      if (this.isForgotPasswordMode) {
        const success = this.authService.resetPassword(email);
        this.isLoading = false;
        if (success) {
          this.successMessage = 'Un email de réinitialisation a été envoyé.';
          
          // Retour automatique à l'écran de connexion après 2 secondes
          setTimeout(() => {
            this.backToLogin();
          }, 2000);
          
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'envoi.';
        }
        return;
      }

      // CAS 2 : Mode connexion classique
      const success = this.authService.login(email, password);
      this.isLoading = false;
      
      if (success) {
        // Redirection vers le formulaire d'alerte en cas de succès
        this.router.navigate(['/form']);
      } else {
        this.errorMessage = 'Email ou mot de passe incorrect.';
      }
    }, 1000);
  }

  onRegister() {
    if (this.authForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email, password } = this.authForm.value;
    
    this.userService.register({ mail: email, motdepasse: password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        alert('Utilisateur enregistré avec succès dans la base de données !');
        this.successMessage = 'Compte créé ! Vous pouvez vous connecter.';
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erreur :', err);
        this.errorMessage = "Erreur lors de la création du compte.";
      }
    });
  }
}
