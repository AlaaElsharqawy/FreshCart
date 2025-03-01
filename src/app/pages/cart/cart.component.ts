import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart/cart.service';
import { ICart } from '../../shared/interfaces/icart';
import { CurrencyPipe } from '@angular/common';

import { RouterLink } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe ,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit{
  isLoding:boolean=false;

  private readonly cartService=inject(CartService);
  cartDetails:ICart={} as ICart;

  ngOnInit(): void {
  this.ShowUserCart();
  }

  

ShowUserCart():void{
  this.cartService.GetLoggedUserCart().subscribe({
    next:(res)=>{
      console.log(res.data);
      this.cartDetails=res.data;
      this.cartService.cartNumber.set(res.numOfCartItems)
    },
    error:(err)=>{
         console.log(err);
    }
  })
}

removeProduct(productId:string):void{


  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {

      this.cartService.RemoveSpecificCartItem(productId).subscribe({
        next:(res)=>{
          console.log(res)
          this.cartDetails=res.data;
          this.cartService.cartNumber.set(res.numOfCartItems);
        },
        error:(err)=>{
          console.log(err)
        }
       })


      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
    }
  });

}

updateCount(productId:string,newCount:number):void{
  this.cartService.UpdateCartProductQuantity(productId,newCount).subscribe({
  next:(res)=>{
    console.log(res);
    this.cartDetails=res.data;
  },
  error:(err)=>{
    console.log(err);
  }
})
}


clearCart():void{
 const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn-main",
      cancelButton: "btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "Are you sure Delete All Products in Cart?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel!",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {


      this.cartService.ClearUserCart().subscribe({
        next:(res)=>{
    
          console.log(res)
          
          if(res.message==='success'){
            this.cartDetails={} as ICart;
            this.cartService.cartNumber.set(0);
           
           
          }
         
        },
        error:(err)=>{
          console.log(err)
          
        }
      })
      swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });


      
    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Your imaginary file is safe :)",
        icon: "error"
      });
    }
  });
 
 
}






}
