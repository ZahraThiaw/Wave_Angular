// signup.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface SignupData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  role: 'client';
  password: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: true,
  imports: [FormsModule, RouterLink]
})
export class SignupComponent {
  signupData: SignupData = {
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    role: 'client',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Données d\'inscription:', this.signupData);
    // Ici, vous pouvez ajouter la logique d'inscription
    this.router.navigate(['/login']);
  }
}