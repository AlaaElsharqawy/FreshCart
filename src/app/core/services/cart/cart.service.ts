import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClient:HttpClient) { }

 cartNumber:WritableSignal<number>=signal(0);

  AddProductToCart(id:string):Observable<any>{
     return  this.httpClient.post(`${environment.baseUrl}/api/v1/cart`,
      {
        "productId": id
    },
    

    )
  }

  GetLoggedUserCart():Observable<any>{
    return  this.httpClient.get(`${environment.baseUrl}/api/v1/cart`)
 }

 RemoveSpecificCartItem(productId:string):Observable<any>{
  return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart/${productId}`)
 }


 UpdateCartProductQuantity(productId:string,newCount:number):Observable<any>{
  return this.httpClient.put(`${environment.baseUrl}/api/v1/cart/${productId}`,
  {
      "count": newCount
  }

 
)
 }


 ClearUserCart():Observable<any>{
   return this.httpClient.delete(`${environment.baseUrl}/api/v1/cart`)
 }

}
