// transaction.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface TransactionType {
  id: number;
  libelle: string;
}

export interface User {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  carte?: string;
}

export interface Transaction {
  id: number;
  montant: string;
  destinataire: number | null;
  agent: number | null;
  exp: number | null;
  type_id: number;
  type: TransactionType;
  users_transaction_destinataireTousers: User | null;
  users_transaction_agentTousers: User | null;
  users_transaction_expTousers: User | null;
}

export interface ApiResponseList {
  data: Transaction[];
  message: string;
  status: number;
  links: any;
}

export interface ApiResponseSingle {
  data: Transaction;
  message: string;
  status: number;
  links: any;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly API_URL = '/api/transactions';
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getTransactions(): Observable<ApiResponseList> {
    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${this.authService.getToken()}`
    );
    return this.http.get<ApiResponseList>(this.API_URL, { headers });
  }

  getTransactionDetails(id: number): Observable<ApiResponseSingle> {
    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${this.authService.getToken()}`
    );
    return this.http.get<ApiResponseSingle>(`${this.API_URL}/${id}`, { headers });
  }

  getTransactionLabel(transaction: Transaction): string {
    const currentUser = this.authService.getUser();
    
    if (transaction.type.libelle === 'transfert') {
      if (transaction.exp === currentUser.id) {
        return `À ${transaction.users_transaction_destinataireTousers?.prenom} ${transaction.users_transaction_destinataireTousers?.nom} ${transaction.users_transaction_destinataireTousers?.telephone}`;
      } else {
        return `De ${transaction.users_transaction_expTousers?.prenom} ${transaction.users_transaction_expTousers?.nom} ${transaction.users_transaction_expTousers?.telephone}`;
      }
    } else if (transaction.type.libelle === 'retrait') {
      return 'Retrait';
    } else if (transaction.type.libelle === 'depot') {
      return 'Dépôt';
    }
    return '';
  }

  getAmountClass(transaction: Transaction): string {
    const currentUser = this.authService.getUser();
    const isNegative = 
      transaction.type.libelle === 'retrait' || 
      (transaction.type.libelle === 'transfert' && transaction.exp === currentUser.id);
    return `text-lg font-medium text-blue-600`;
  }

  getAmountPrefix(transaction: Transaction): string {
    const currentUser = this.authService.getUser();
    const isNegative = 
      transaction.type.libelle === 'retrait' || 
      (transaction.type.libelle === 'transfert' && transaction.exp === currentUser.id);
    return isNegative ? '-' : '';
  }

  filterTransactions(transactions: Transaction[], searchTerm: string): Transaction[] {
    if (!searchTerm) return transactions;

    const searchTermLower = searchTerm.toLowerCase().trim();

    return transactions.filter(transaction => {
      // Search by transaction type
      if (transaction.type.libelle.toLowerCase().includes(searchTermLower)) return true;

      // Search by sender or recipient name, firstname, or phone
      const exp = transaction.users_transaction_expTousers;
      const dest = transaction.users_transaction_destinataireTousers;
      const agent = transaction.users_transaction_agentTousers;

      const searchInUser = (user: User | null) => {
        if (!user) return false;
        return (
          (user.nom && user.nom.toLowerCase().includes(searchTermLower)) ||
          (user.prenom && user.prenom.toLowerCase().includes(searchTermLower)) ||
          (user.telephone && user.telephone.toLowerCase().includes(searchTermLower))
        );
      };

      return (
        searchInUser(exp) ||
        searchInUser(dest) ||
        searchInUser(agent)
      );
    });
  }

  // Get last 10 transactions sorted by most recent
  getLast10Transactions(transactions: Transaction[]): Transaction[] {
    return transactions
      .sort((a, b) => b.id - a.id) // Sort by ID in descending order (assuming higher ID means more recent)
      .slice(0, 10);
  }
}
