import { Routes } from '@angular/router';
import { LandingPage } from './components/pages/landing-page/landing-page';
import { ProductsPage } from './components/pages/products-page/products-page';
import { LoginPage } from './components/pages/login-page/login-page';
import { UserConfPage } from './components/pages/userConf-page/userConf-page';
import { UserConfGuard } from './guards/UserConfGuard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'products', component: ProductsPage },
  { path: 'userconf', canActivate: [UserConfGuard], component: UserConfPage },
  { path: '**', redirectTo: '' },
];
