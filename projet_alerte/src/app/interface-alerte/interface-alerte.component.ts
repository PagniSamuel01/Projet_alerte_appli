import { Component, Input, OnInit } from '@angular/core';
import { message, ReactiveModForm } from '../configiuration-alerte/configiuration-alerte.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-interface-alerte',
  standalone: true, // Composant autonome (pas besoin de module Angular classique)
  imports: [ReactiveFormsModule], // Import du module pour les formulaires réactifs
  templateUrl: './interface-alerte.component.html',
  styleUrls: ['./interface-alerte.component.scss']
})
export class InterfaceAlerteComponent implements OnInit {
  // Données pour les messages
  donnee = new message('Veuillez remplir tous les champs du formulaire svp!');
  
  // Instance de la logique du formulaire
  affich = new ReactiveModForm();

  // Variables pour les libellés affichés dans le HTML
  type_appli!: string;
  alerte!: string;
  titre_form!: string; 
  email!: string;

  /**
   * Initialisation des textes du composant au démarrage.
   */
  ngOnInit(): void {
    this.type_appli = 'Application';
    this.alerte = 'Date d\'alerte';
    this.titre_form = "Formulaire d'alerte";
    this.email = "Adresse mail";
  }
}

