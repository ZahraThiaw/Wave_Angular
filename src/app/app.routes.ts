// app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './ auth.guard';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { TransferComponent } from './transfer/transfer.component';
import { PaymentComponent } from './payment/payment.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]  // Protection de la route
  },
  {
    path: 'transfer',
    component: TransferComponent,
    canActivate: [authGuard]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    canActivate: [authGuard]
  },
  { path: 'transaction/:id', component: TransactionDetailsComponent, canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];