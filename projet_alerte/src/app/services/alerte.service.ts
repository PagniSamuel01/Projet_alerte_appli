import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
@Injectable(
  {providedIn:'root'}
)
export class AlerteService{
  constructor(private http:HttpClient){}
  private urlapi="http://192.168.1.189:8080/form-alerte"
getalerte():Observable<any>{
  return this.http.get(this.urlapi)
}

  posteAlerte(donnee: any): Observable<any> {
    return this.http.post(this.urlapi + '/alerte', donnee);
  }
}



