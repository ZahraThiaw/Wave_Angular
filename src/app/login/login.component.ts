import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface LoginData {
  telephone: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  loginData: LoginData = {
    telephone: '',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.loginData.telephone && this.loginData.password) {
      // Ici, vous pourriez ajouter la logique d'authentification
      console.log('Tentative de connexion avec:', this.loginData);
      
      // Simulons une connexion réussie et redirigeons vers le dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}