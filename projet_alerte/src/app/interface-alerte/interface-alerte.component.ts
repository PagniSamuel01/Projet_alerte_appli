import { Component, Input, OnInit} from '@angular/core';
import { message, ReactiveModForm } from '../configiuration-alerte/configiuration-alerte.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-interface-alerte',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl:'./interface-alerte.component.html',
  styleUrls: ['./interface-alerte.component.scss']
})
export class InterfaceAlerteComponent implements OnInit {
  @Input() donnee!: message;
  @Input() affich!: ReactiveModForm;

  type_appli!: string;
  alerte!: string;
  titre_form!: string; 
  email!: string;

  ngOnInit(): void {
    this.type_appli = 'Application';
    this.alerte = 'Date d\'alerte';
    this.titre_form = "Formulaire d'alerte";
    this.email = "Adresse mail";
  }
}

