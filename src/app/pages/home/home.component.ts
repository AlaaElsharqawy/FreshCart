import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products/products.service';

import { IProduct } from '../../shared/interfaces/iproduct';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { ICategory } from '../../shared/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TermtextPipe } from '../../shared/pipes/termtext.pipe';

import { FormsModule } from '@angular/forms';
import { SearchPipe } from "../../shared/pipes/Search/search.pipe";
import { CartService } from '../../core/services/cart/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { WishlistService } from '../../core/services/wishlist/wishlist.service';
import { IWishlist } from '../../shared/interfaces/iwishlist';



@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, TermtextPipe, FormsModule, SearchPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {



  private readonly  productService=inject(ProductsService); 
  private readonly categoriesService=inject(CategoriesService);
  private readonly cartService=inject(CartService);
  private readonly toastrService=inject(ToastrService);
 
  private readonly wishlistService=inject(WishlistService);
  wishlist: WritableSignal<Set<string>> = signal(new Set());

  products:WritableSignal<IProduct[]>=signal([]);

  categories:WritableSignal<ICategory[]>=signal([]);
  
  text:string="";
wishlistDetails:WritableSignal<IWishlist[]>=signal([]);
count:WritableSignal<number>=signal(0);

  customMainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay:true,
    autoplayTimeout:2000,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: false
  }


  customOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    autoplayTimeout:3000,
     autoplayHoverPause:true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  }


  ngOnInit(): void {
    this.getProductsData();
    this.getCategoriesData();
    this.showWishlist()
  }

 

  getProductsData():void{
  
    this.productService.getAllProducts().subscribe({
      next:(response)=>{
          // console.log(response.data);
          this.products.set(response.data);
      
         
      }
     
    })
  }
  getCategoriesData():void{
    this.categoriesService.getAllCategories().subscribe({
      next:(response)=>{
        console.log(response);
        this.categories.set(response.data);
      }
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












}
