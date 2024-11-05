import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CagnotteUser {
  users_id: number;
  cagnotte_id: number;
  users: {
    id: number;
    nom: string;
    prenom: string;
    solde: string;
  };
}

export interface Cagnotte {
  id: number;
  nom: string;
  users_id: number;
  montant: string;
  montant_objectif: string;
  etat: boolean;
  users_cagnotte: CagnotteUser[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  links: any;
}

@Injectable({
  providedIn: 'root'
})
export class CagnotteService {
  private baseUrl = 'http://localhost:3005/cagnotte';

  constructor(private http: HttpClient) {}

  getOpenCagnottes(): Observable<ApiResponse<Cagnotte[]>> {
    return this.http.get<ApiResponse<Cagnotte[]>>(`${this.baseUrl}/open`);
  }

  createCagnotte(data: { nom: string; montant_objectif: number }): Observable<ApiResponse<Cagnotte>> {
    return this.http.post<ApiResponse<Cagnotte>>(`${this.baseUrl}/create`, data);
  }

  contribute(cagnotteId: number, montant: number): Observable<ApiResponse<Cagnotte>> {
    return this.http.post<ApiResponse<Cagnotte>>(`${this.baseUrl}/${cagnotteId}/contribute`, { montant });
  }
}