import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutService } from '../../core/services/checkout/checkout.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Invoice } from '../../shared/interfaces/invoice';


@Component({
  selector: 'app-check-out',
  imports: [ReactiveFormsModule],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent implements OnInit{
  isLoding:boolean=false;
 cartId:string="";
 msgError:string="";
success:string="";
  checkOutForm!:FormGroup;
  private readonly formBuilder=inject(FormBuilder);
  private readonly checkoutService=inject(CheckoutService);
  private readonly activatedRoute=inject(ActivatedRoute);
  private readonly router=inject(Router);
 


  ngOnInit(): void {
    this.initForm();
    this.getCartId();
  }

  initForm():void{
    this.checkOutForm=this.formBuilder.group({

      details: [null,[Validators.required]],
       phone: [null,[Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]],
       city:[null,Validators.required]

   })
  }

 getCartId():void{
  this.activatedRoute.paramMap.subscribe({
    next:(param)=>{
      this.cartId = param.get('id')!;
      console.log(this.cartId)
    }
  })
 }


  checkOutFormSubmit():void{
   if(this.checkOutForm.valid){

    this.checkoutService.CheckoutSession(this.cartId,this.checkOutForm.value).subscribe({
     next:(res)=>{
       
       console.log(res.session.url)
       if(res.status==='success','_self'){
         window.open(res.session.url);
       }
   
    
     },
     error:(err)=>{
       console.log(err)
       
     }
    })
   }
  }

  cashForm():void{
    if(this.checkOutForm.valid){
      this.checkoutService.CreateCashOrder(this.cartId,this.checkOutForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          this.checkoutService.invoiceData.set(res.data);
          this.router.navigate(['/invoice'])
          setTimeout(()=>{
            this.router.navigate(['/home']);
          },4000);
        },
        error(err) {
          console.log(err) 
        }

      })
  }

 


}
}
