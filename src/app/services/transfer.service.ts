// transfer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  solde: string;
  email: string;
  code: string;
  promo: string;
  carte: string;
  etatcarte: boolean;
  role_id: number;
  used_promo_codes: any[];
}

export interface TransferResponse {
  data: {
    sender: User;
    receiver: User;
    transaction: {
      id: number;
      montant: string;
      destinataire: number;
      agent: null;
      exp: number;
      type_id: number;
    };
    montant: number;
  };
  message: string | number;
  status: string;
  links: null;
}

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private readonly API_URL = 'http://localhost:3005';
  private transfersUpdated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  getClients(): Observable<{data: User[]}> {
    return this.http.get<{data: User[]}>(`/api/users/clients`);
  }

  performTransfer(montant: number, destinataire: string): Observable<TransferResponse> {
    return this.http.post<TransferResponse>(`${this.API_URL}/transferer`, {
      montant,
      destinataire
    }).pipe(
      tap(() => this.transfersUpdated.next(true))
    );
  }

  getTransfersUpdateListener() {
    return this.transfersUpdated.asObservable();
  }

  resetTransfersUpdate() {
    this.transfersUpdated.next(false);
  }
  
}