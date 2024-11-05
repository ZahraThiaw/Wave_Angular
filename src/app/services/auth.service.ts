import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    solde: string;
    code: string;
    promo: string;
    carte: string;
    etatcarte: boolean;
    role_id: number;
  };
}

export interface LoginRequest {
  numero: string;
  code: string;
}

export interface SignupData {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  roleId: number;
  password: string;
}

export interface SignupResponse {
  data: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    solde: string;
    code: string;
    promo: string;
    carte: string;
    etatcarte: boolean;
    role_id: number;
  };
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = '/api';
  private readonly isBrowser: boolean;

  // Store user data in memory as fallback when localStorage isn't available
  private memoryToken: string | null = null;
  private memoryUser: any = null;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private setStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
    // Also store in memory
    if (key === 'token') this.memoryToken = value;
    if (key === 'user') this.memoryUser = JSON.parse(value);
  }

  private getStorageItem(key: string): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(key);
    }
    // Fallback to memory storage
    if (key === 'token') return this.memoryToken;
    if (key === 'user') return this.memoryUser ? JSON.stringify(this.memoryUser) : null;
    return null;
  }

  private removeStorageItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
    // Also clear from memory
    if (key === 'token') this.memoryToken = null;
    if (key === 'user') this.memoryUser = null;
  }

  login(numero: string, code: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { numero, code };
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(response => {
          this.setStorageItem('token', response.token);
          this.setStorageItem('user', JSON.stringify(response.user));
        })
      );
  }

  logout(): void {
    const token = this.getToken();
    if (!token) {
      this.performFrontendLogout();
      return;
    }
  
    this.http.post(`${this.API_URL}/logout`, {}, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    }).subscribe({
      next: () => this.performFrontendLogout(),
      error: err => {
        console.error("Erreur lors de la déconnexion côté backend :", err);
        this.performFrontendLogout();
      }
    });
  }

  private performFrontendLogout(): void {
    this.removeStorageItem('token');
    this.removeStorageItem('user');
    this.router.navigate(['/login']).then(() => {
      if (this.isBrowser) {
        history.pushState(null, '', '/login');
      }
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser() {
    const user = this.getStorageItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return this.getStorageItem('token');
  }

  register(signupData: SignupData): Observable<SignupResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<SignupResponse>(`${this.API_URL}/user/create`, signupData, { headers })
      .pipe(
        tap(response => {
          console.log('Inscription réussie:', response.message);
        })
      );
  }

  updateUserBalance(newBalance: string) {
    const user = this.getUser();
    if (user) {
      user.solde = newBalance;
      this.setStorageItem('user', JSON.stringify(user));
    }
  }
}