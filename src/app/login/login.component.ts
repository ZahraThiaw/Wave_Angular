import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

interface LoginData {
  telephone: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule]
})
export class LoginComponent {
  loginData: LoginData = {
    telephone: '',
    password: ''
  };
  
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    if (this.loginData.telephone && this.loginData.password) {
      this.isLoading = true;
      this.errorMessage = '';
  
      const numero = this.loginData.telephone.replace('+221', '').trim();
      
      this.authService.login(numero, this.loginData.password)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message;
          },
          complete: () => {
            this.isLoading = false;
          }
        });
    }
  }
  
}