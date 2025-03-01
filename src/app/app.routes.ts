import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { authGuard } from './core/guards/AuthGuard/auth.guard';
import { lockedGuard } from './core/guards/lockedGuard/locked.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { 
        path: '', 
        component: AuthLayoutComponent,canActivate:[lockedGuard],
        children: [
            { 
                path: 'login', 
                loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), 
                title: 'Login' 
            },
            { 
                path: 'register', 
                loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), 
                title: 'Register' 
            },

            { 
                path: 'forget', 
                loadComponent: () => import('./pages/forgetPassword/forget-password/forget-password.component').then(m => m.ForgetPasswordComponent), 
                title: 'Forget Password' 
            },
     
        ]
    },

    { 
        path: '', 
        component: BlankLayoutComponent,canActivate:[authGuard],
        children: [
            { 
                path: 'home', 
                loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), 
                title: 'Home' 
            },
            { 
                path: 'cart', 
                loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent), 
                title: 'Cart' 
            },
            { 
                path: 'wishlist', 
                loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent), 
                title: 'wishList' 
            },
            { 
                path: 'products', 
                loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent), 
                title: 'Products' 
            },
            { 
                path: 'brands', 
                loadComponent: () => import('./pages/brands/brands.component').then(m => m.BrandsComponent), 
                title: 'Brands' 
            },
            { 
                path: 'categories', 
                loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent), 
                title: 'Categories' 
            },
            { 
                path: 'checkout/:id', 
                loadComponent: () => import('./pages/check-out/check-out.component').then(m => m.CheckOutComponent), 
                title: 'Checkout' 
            },
            { 
                path: 'details/:id', 
                loadComponent: () => import('./pages/details/details.component').then(m => m.DetailsComponent), 
                title: 'Details' 
            },
            { 
                path: 'allorders', 
                loadComponent: () => import('./pages/allorders/allorders.component').then(m => m.AllordersComponent), 
                title: 'AllOrders' 
            },

            { 
                path: 'invoice', 
                loadComponent: () => import('./pages/invoice/invoice.component').then(m => m.InvoiceComponent), 
                title: 'Invoice' 
            },

            
            { 
                path: '**', 
                loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent), 
                title: 'Not Found' 
            },
        ]
    }
];
