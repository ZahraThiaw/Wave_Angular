import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Society {
  id: number;
  nom: string;
  secteur: string;
  telephone: string;
}

export interface PaymentResponse {
  data: {
    id: number;
    user_id: number;
    numero_facture: string;
    montant_total: string;
    montant_paye: string;
    societe_id: number;
    status: string;
    date_creation: string;
  };
  message: string;
  status: number;
  links: null;
}

export interface PaymentPayload {
  userId: number;
  numeroFacture: string;
  montantTotal: number;
  montantPaye: number;
  societeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getSocieties(): Observable<{ data: Society[]; message: string; status: number; links: null }> {
    return this.http.get<{ data: Society[]; message: string; status: number; links: null }>(
      '/api/societies'
    );
  }

  processBillPayment(payload: PaymentPayload): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>('/api/bill-payment', payload);
  }

  getSocietyIcon(secteur: string): string {
    switch (secteur.toLowerCase()) {
      case 'electricité':
        return 'fa-bolt text-yellow-500';
      case 'eau':
        return 'fa-tint text-blue-500';
      default:
        return 'fa-building text-gray-500';
    }
  }
}