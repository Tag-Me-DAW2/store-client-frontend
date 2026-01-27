import { Routes } from '@angular/router';
import { LandingPage } from './components/pages/landing-page/landing-page';
import { ProductsPage } from './components/pages/products-page/products-page';
import { LoginPage } from './components/pages/login-page/login-page';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  {path: 'products', component: ProductsPage},
  {path: '**', redirectTo: ''},
];
