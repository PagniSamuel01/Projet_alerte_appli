import { FormGroup, FormControl, Validators } from '@angular/forms';

export class message {
    public message_envoyer?:string
    constructor(message_envoyer?:string){
      this.message_envoyer=message_envoyer
    }
}
export class ReactiveModForm{
    formGroup= new FormGroup({
        type_appli:new FormControl('',[Validators.required]),
        email:new FormControl('',[Validators.required]),
        alerte:new FormControl('',[Validators.required])
    });
    onbutton(){
        this.formGroup.markAllAsTouched();
        console.log(this.formGroup.value)
    }
} 