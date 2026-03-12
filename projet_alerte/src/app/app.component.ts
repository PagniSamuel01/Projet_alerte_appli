import { Component } from '@angular/core';
import { InterfaceAlerteComponent } from './interface-alerte/interface-alerte.component';
import { message,ReactiveModForm} from './configiuration-alerte/configiuration-alerte.component';

@Component({
  selector: 'app-root',
  imports: [InterfaceAlerteComponent],
  templateUrl: './app.component.html',
  styleUrls:[ './app.component.scss']
})
export class AppComponent {
  config= new message('Veillez remplir tout les champs du formulaire svp!')
  aff= new ReactiveModForm ()
}
