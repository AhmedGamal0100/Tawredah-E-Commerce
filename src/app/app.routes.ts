import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth.layout/auth.layout';
import { LandingPage } from './pages/landing.page/landing.page';
import { formDeactivationGuard } from './core/guards/form-deactivation.guard';
import { HomeLayoutComponent } from './layout/home.layout/home.layout.component';
import { SupplierLayoutComponent } from './layout/supplier.layout/supplier.layout.component';
import { DashboardPageComponent } from './pages/supplier/dashboard-page/dashboard-page';
import { AuthActivatedGuard } from './core/guards/Auth-activated.guard';
import { redirectIfLoggedGuard } from './core/guards/redirectIfLogged.guard';
import { roleActivatedGuard } from './core/guards/role-activated.guard';
import { InventoryPageComponent } from './pages/supplier/inventory-page/inventory-page';
import { AdminLayoutComponent } from './layout/admin.layout/admin.layout/admin.layout.component';

export const routes: Routes = [

  // Admin Layout
  {
    path:'admin',
    component:AdminLayoutComponent
  },

  // ✅ Supplier Layout (Factories)
  {
    path: 'supplier',
    component: SupplierLayoutComponent,
    canActivate: [AuthActivatedGuard, roleActivatedGuard],
    data: { roles: ['factory'] },
    children: [
      { path: '', component: InventoryPageComponent },
      {
        path: 'pastorders',
        loadComponent: () =>
          import('./pages/supplier/recent-orders.page/recent-orders.page').then(m => m.RecentOrdersPage),
      },
      {
        path: 'custom-requests',
        loadComponent: () =>
          import('./pages/supplier/customization-requests-page/customization-requests-page').then(m => m.CustomizationRequestsPageComponent),
      },
      // {
      //   path: 'inventory',
      //   loadComponent: () =>
      //     import('./pages/supplier/inventory-page/inventory-page').then(m => m.InventoryPageComponent),
      // },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/supplier/profile.page/profile-page/profile-page').then(m => m.ProfilePage),
      },
      {
        path: 'add-product',
        loadComponent: () => import('./pages/supplier/add-product/add-product').then(m => m.AddProductComponent)
      },
      {
        path: 'myproducts',
        loadComponent: () =>
          import('./pages/supplier/products-list.page/products-list.page').then(m => m.ProductsListPage),
      },

      // ✅ Supplier Not Found (only for suppliers)
      // {
      //   path: '**',
      //   loadComponent: () =>
      //     import('./pages/supplier/not-found-supplier/not-found-supplier').then(m => m.NotFoundSupplierComponent),
      // }
    ]
  },

  // ✅ User Layout
  {
    path: '',
    component: HomeLayoutComponent,
    children: [
      { path: '', component: LandingPage, canActivate: [redirectIfLoggedGuard] },
      {
        path: 'profile',
        canActivate: [AuthActivatedGuard, roleActivatedGuard],
        data: { roles: ['user'] }, // Only normal users
        loadComponent: () =>
          import('./pages/profile.page/profile-page/profile-page').then(m => m.ProfilePage),
      },
      {
        path: 'productDetails/:id',
        loadComponent: () =>
          import('./pages/product-details.page/product-details-page/product-details-page').then(m => m.ProductDetailsPage),
      },
      {
        path: 'cart',
        canActivate: [AuthActivatedGuard],
        loadComponent: () =>
          import('./pages/cart.page/cart.page').then(m => m.CartPage),
      },
      {
        path: 'notifications',
        canActivate: [AuthActivatedGuard],
        loadComponent: () =>
          import('./pages/notifications.page/notifications.page').then(m => m.NotificationsPage),
      },
      {
        path: 'checkout',
        canActivate: [AuthActivatedGuard],
        loadComponent: () =>
          import('./pages/checkout.page/checkout.page').then(m => m.CheckoutPage),
      },
      {
        path: 'pastorders',
        canActivate: [AuthActivatedGuard],
        loadComponent: () =>
          import('./pages/past-orders.page/past-orders.page').then(m => m.PastOrdersPage),
      },
      {
        path: 'products', // ✅ No guard → open for everyone
        // canActivate: [roleActivatedGuard],
        // data: { roles: ['user'] },
        loadComponent: () =>
          import('./pages/search-page/search-page').then(m => m.SearchPageComponent),
      },
      {
        path: 'wishlist',
        canActivate: [AuthActivatedGuard],
        loadComponent: () =>
          import('./pages/wishlist.page/wishlist.page').then(m => m.WishlistPage),
      },
      {
        path: 'requested-products', // ✅ No guard → open for everyone
        // canActivate: [roleActivatedGuard],
        // data: { roles: ['user'] },
        loadComponent: () =>
          import('./pages/requested-product.page/requested-product.page').then(m => m.RequestedProductsPage),
      },
      {
        path: 'requested-products-form',
        canActivate: [AuthActivatedGuard],
        loadComponent: () =>
          import('./pages/requested-product-form.page/requested-product-form.page').then(m => m.RequestedProductFormPage),
      },
      {
        path: 'requested-products-details', // ✅ Open for all
        // path: 'profile',
        canActivate: [roleActivatedGuard],
        loadComponent: () =>
          import('./pages/requested-product-details.page/requested-product-details.page').then(
            (m) => m.RequestedProductDetailsPage
          ),
      },
      {
        path: 'requested-products-details/:id',
        loadComponent: () =>
          import('./pages/requested-product-details.page/requested-product-details.page').then(m => m.RequestedProductDetailsPage),
      },
    ]
  },


  // ✅ Auth Layout
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login.page/login.page').then(m => m.LoginPage),
      },
      {
        path: 'register',
        canDeactivate: [formDeactivationGuard],
        loadComponent: () =>
          import('./pages/register.page/register.page').then(m => m.RegisterPage),
      },
    ],
  },

  // ✅ Unauthorized Page
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./pages/not-autherized.page/not-autherized.page.component').then(m => m.NotAutherizedPageComponent),
  },

  // ✅ Global Fallback (if nothing matches at all)
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found.page/not-found.page').then(m => m.NotFoundPage),
  }
];
