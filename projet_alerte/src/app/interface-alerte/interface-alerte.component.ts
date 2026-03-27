import { Component, OnInit } from '@angular/core';
import { message, ReactiveModForm } from '../configiuration-alerte/configiuration-alerte.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import{AlerteService} from '../services/alerte.service';


@Component({
  selector: 'app-interface-alerte',
  standalone: true, // Composant autonome (pas besoin de module Angular classique)
  imports: [ReactiveFormsModule, FormsModule], // Import du module pour les formulaires réactifs et template-driven (ngModel)
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

  users: any[] = [];

  constructor(private userService: UserService,private alerteService: AlerteService){}
  /**
   * Initialisation des textes du composant au démarrage.
   */
  ngOnInit(): void {
    this.type_appli = 'Application';
    this.alerte = 'Date d\'alerte';
    this.titre_form = "Formulaire d'alerte";
    this.email = "Adresse mail";

    this.userService.getUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error("Erreur backend:", err)
    });
  }
 onSubmit(){
  if (this.affich.formGroup.valid){
    this.alerteService.posteAlerte(this.affich.formGroup.value).subscribe({
      next:(response) =>{
        console.log(response)
        this.donnee.message_envoyer="Alerte envoyée avec succès";
        this.affich.formGroup.reset()
      },
      error:(err) => {
        console.error("Erreur lors de l'envoie d\'alerte",err)
      }
      });
     }
      else{
      this.affich.onbutton()
    }
 }
}
