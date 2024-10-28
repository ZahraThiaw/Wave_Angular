import { Routes } from '@angular/router';

// Importer les composants de connexion et de tableau de bord
import { LoginComponent } from './login/login.component'; 
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Rediriger vers la page de connexion par défaut
  { path: 'login', component: LoginComponent }, // Route pour la page de connexion
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent }, // Route pour le tableau de bord


  // Redirection si route non trouvée
  { path: '**', redirectTo: 'login' }
];
