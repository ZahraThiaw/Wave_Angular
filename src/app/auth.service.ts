import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  }
}

export interface LoginRequest {
  numero: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api'; // Utilise le proxy configuré

  login(numero: string, code: string): Observable<LoginResponse> {
    const loginData: LoginRequest = {
      numero,
      code
    };

    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}