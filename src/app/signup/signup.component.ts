import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, SignupData } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule]
})
export class SignupComponent {
  signupData: SignupData = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    roleId: 2,  // Supposons que le rôle 'client' est représenté par roleId = 2
    password: ''
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.register(this.signupData).subscribe({
      next: (response) => {
        console.log('Données d\'inscription:', response);
        this.successMessage = response.message;
        this.router.navigate(['/login']); // Redirige vers la page de connexion
      },
      error: (error) => {
        console.error('Erreur lors de l\'inscription:', error);
        console.log('Erreur lors de l\'inscription. Veuillez réessayer.');
        this.errorMessage = error.message;
      }
    });
  }
}
