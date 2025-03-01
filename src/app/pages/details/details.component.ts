import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products/products.service';
import { IProduct } from '../../shared/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';

@Component({
  selector: 'app-details',
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

private readonly activatedRoute=inject(ActivatedRoute);
private readonly productsService=inject(ProductsService);
private readonly cartService=inject(CartService);
private readonly toastrService=inject(ToastrService);
private readonly wishlistService=inject(WishlistService);
wishlist: WritableSignal<Set<string>> = signal(new Set());
    detailsProduct = signal<IProduct | null>(null);
    wishlistDetails:WritableSignal<IWishlist[]>=signal([]);
    count:WritableSignal<number>=signal(0);

  ngOnInit(): void {

    this.showWishlist();
    this.activatedRoute.paramMap.subscribe({
      next:(p)=>{
       let productId=p.get('id');

       //call api  ===>productService===getProductSpecific
          this.productsService.getSpecificProduct(productId)!.subscribe({
              next:(res)=>{
                 console.log(res.data);
                 this.detailsProduct.set(res.data);
              },
              error:(err)=>{
                console.log(err);
              }
          })

        
      }
    })
  }


 detailSliderOptions: OwlOptions = {
  loop: true,
  autoplay:true,
  autoplayTimeout:3000,
   autoplayHoverPause:true,
  mouseDrag: true,
  touchDrag: true,
  pullDrag: true,
  dots: false,
  navSpeed: 700,
  navText: ['', ''],
  items:1,
  nav: false
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
