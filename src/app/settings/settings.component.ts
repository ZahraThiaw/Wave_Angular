import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  
  userPhone: string = '';
  
  constructor() {
    // Récupérer le numéro de téléphone de l'utilisateur connecté
    const user = this.authService.getUser();
    console.log('user', user);
    
    this.userPhone = user?.telephone || '';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}