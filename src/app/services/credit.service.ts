import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  solde: string;
}

export interface CreditResponse {
  data: {
    transaction: {
      id: number;
      montant: string;
      destinataire: string | null;
      agent: string | null;
      exp: number;
      type_id: number;
      Date: string;
      type: {
        id: number;
        libelle: string;
      };
      users_transaction: Array<{
        users_id: number;
        transaction_id: number;
        role: string;
      }>;
      users_transaction_expTousers: {
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
    };
    nouveauSolde: string;
  };
  message: string;
  status: number;
  links: any;
}

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private readonly apiUrl = '/api'; // URL relative qui sera gérée par le proxy

  constructor(private http: HttpClient) {}

  getClients(): Observable<{ data: Client[] }> {
    return this.http.get<{ data: Client[] }>(`${this.apiUrl}/users/clients`);
  }

  purchaseCredit(telephone: string, montant: number): Observable<CreditResponse> {
    return this.http.post<CreditResponse>(`${this.apiUrl}/achatcredit`, {
      telephone,
      montant
    });
  }

  isValidPhoneNumber(number: string): boolean {
    // Validation des numéros de téléphone sénégalais (70, 75, 76, 77, 78)
    return /^(70|75|76|77|78)\d{7}$/.test(number);
  }
}