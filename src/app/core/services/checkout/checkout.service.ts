import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Invoice } from '../../../shared/interfaces/invoice';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  invoiceData: WritableSignal<Invoice | null> = signal<Invoice | null>(null);
  constructor(private httpClient:HttpClient) { }


  CheckoutSession(cartId:string,data:object):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,{
      "shippingAddress":  data
      }
    
  
      )
}

CreateCashOrder(cartId:string,data:object):Observable<any>{
  return this.httpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`,{
    "shippingAddress":  data
    },
  

    )
}


}
