import { Routes } from '@angular/router';
import { LandingPage } from './components/pages/landing-page/landing-page';
import { ProductsPage } from './components/pages/products-page/products-page';
import { LoginPage } from './components/pages/login-page/login-page';
import { UserConfPage } from './components/pages/userConf-page/userConf-page';
import { SessionGuard } from './guards/SessionGuard';
import { PaymentPage } from './components/pages/payment-page/payment-page';
import { TecnologiaPage } from './components/pages/tecnologia-page/tecnologia-page';
import { ContantPage } from './components/pages/contant-page/contant-page';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'login', component: LoginPage },
  { path: 'products', component: ProductsPage },
  { path: 'tech', component: TecnologiaPage },
  { path: 'contact', component: ContantPage },
  { path: 'userconf', canActivate: [SessionGuard], component: UserConfPage },
  { path: 'payment', canActivate: [SessionGuard], component: PaymentPage },
  { path: '**', redirectTo: '' },
];
