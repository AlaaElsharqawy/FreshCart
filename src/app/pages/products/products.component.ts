import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/Search/search.pipe';
import { TermtextPipe } from '../../shared/pipes/termtext.pipe';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { IWishlist } from '../../shared/interfaces/iwishlist';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';


@Component({
  selector: 'app-products',
  imports: [RouterLink,FormsModule,SearchPipe,TermtextPipe,NgxPaginationModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent  implements OnInit{


  text:WritableSignal<string>=signal("");
   products: WritableSignal<IProduct[]> =signal([]);
 wishlistDetails:WritableSignal<IWishlist[]>=signal([]);
 count:WritableSignal<number>=signal(0);
 isInWishlist: boolean = false;
 wishlist: WritableSignal<Set<string>> = signal(new Set());

   private readonly productsService=inject(  ProductsService);
   private readonly cartService=inject(  CartService);
   private readonly toastrService=inject(  ToastrService);
   private readonly wishlistService=inject(  WishlistService);




  ngOnInit(): void {
    this.getProductsData();
    this.showWishlist();
  }

  getProductsData():void{
  
    this.productsService.getAllProducts().subscribe({
      next:(response)=>{
          // console.log(response.data);
          this.products.set(response.data);
         
      
         
      }
     
    })
  }


  addToCart(id:string):void{
    this.cartService.AddProductToCart(id).subscribe({
      next:(res)=>{
          this.cartService.cartNumber.set(res.numOfCartItems);

        console.log(res)
      if( res.status==='success'){
        this.toastrService.success(res.message,'FreshCart')
      }
      },
      
    })
  }
 



  showWishlist(): void {
    // محاولة تحميل البيانات من localStorage أولًا
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist.set(new Set(JSON.parse(storedWishlist)));
    }
  
  
    // ثم تحميل البيانات من الـ API لتحديثها
    this.wishlistService.GetLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res);
        this.wishlistDetails.set(res.data);
        this.count.set(res.count);
        
        // حفظ البيانات الجديدة في localStorage بعد جلبها من الـ API
        localStorage.setItem('wishlist', JSON.stringify(res.data));
      }
    });
  }
  
  
  toggleWishlist(productId: string): void {
    const updatedWishlist = new Set(this.wishlist());
  
    if (updatedWishlist.has(productId)) {
      // إزالة المنتج من القائمة
      this.wishlistService.RemoveProductFromWishlist(productId).subscribe({
        next: () => {
          updatedWishlist.delete(productId);
          this.wishlist.set(updatedWishlist);
          localStorage.setItem('wishlist', JSON.stringify([...updatedWishlist])); // تحديث localStorage
          this.toastrService.warning('Removed from Wishlist', 'Wishlist');
        }
      });
    } else {
      // إضافة المنتج إلى القائمة
      this.wishlistService.AddProductToWishlist(productId).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            updatedWishlist.add(productId);
            this.wishlist.set(updatedWishlist);
            localStorage.setItem('wishlist', JSON.stringify([...updatedWishlist])); // تحديث localStorage
            this.toastrService.success(res.message, 'Wishlist');
          }
        }
      });
    }
  }
  
}


