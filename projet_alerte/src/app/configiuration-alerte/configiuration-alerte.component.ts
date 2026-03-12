import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Classe modèle pour gérer les messages d'état de l'application.
 */
export class message {
    // Message qui sera affiché à l'utilisateur (ex: confirmation d'envoi)
    public message_envoyer?: string;

    constructor(message_envoyer?: string) {
        this.message_envoyer = message_envoyer;
    }
}

/**
 * Classe gérant la logique du formulaire réactif.
 */
export class ReactiveModForm {
    // Définition du groupe de formulaires avec ses champs et validateurs
    formGroup = new FormGroup({
        // Nom de l'application : Obligatoire
        type_appli: new FormControl('', [Validators.required]),
        
        // Email : Obligatoire et doit respecter le format standard
        email: new FormControl('', [
            Validators.required, 
            Validators.pattern(/^[\w.-]+@[\w.-]+\.\w{2,4}$/)
        ]),
        
        // Date d'alerte : Obligatoire
        alerte: new FormControl('', [Validators.required])
    });

    /**
     * Méthode appelée lors de la tentative d'envoi du formulaire.
     */
    onbutton() {
        // Force l'affichage des erreurs pour tous les champs si l'utilisateur clique sans remplir
        this.formGroup.markAllAsTouched();
        
        // Affiche les données saisies dans la console pour le débogage
        console.log(this.formGroup.value);
    }
} 

