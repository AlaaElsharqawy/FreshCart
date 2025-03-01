import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit{

private readonly wishlistService=inject(WishlistService);
  private readonly cartService=inject(CartService);
  private readonly toastrService=inject(ToastrService);

wishlistDetails:WritableSignal<IWishlist[]>=signal([]);
count:WritableSignal<number>=signal(0);
isInWishlist: boolean = false;
wishlist: WritableSignal<Set<string>> = signal(new Set());


ngOnInit(): void {
  this.showWishlist();
}






showWishlist():void{
  this.wishlistService.GetLoggedUserWishlist().subscribe({
    next:(res)=>{
      console.log(res)
      this.wishlistDetails.set(res.data);

      
    this.count.set(res.count);

    }
  })
}





removeItemFromWishlist(productId:string):void{


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

   
      this.wishlistService.RemoveProductFromWishlist(productId).subscribe({
        next:(res)=>{
          console.log(res)
          this.wishlistDetails.set(res.data);
    
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


 
addToCart(id:string):void{
  this.cartService.AddProductToCart(id).subscribe({
    next:(res)=>{
        this.cartService.cartNumber.set(res.numOfCartItems);

      console.log(res)
    if( res.status==='success'){

      
      this.toastrService.success(res.message,'FreshCart')
      this.wishlistService.RemoveProductFromWishlist(id).subscribe({
        next:(res)=>{
          console.log(res)
          this.wishlistDetails.set(res.data);
    
        }
      })

    }
    },
    
  })
}


}
