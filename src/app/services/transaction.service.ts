import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
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

export interface Societe {
  id: number;
  nom: string;
  secteur?: string;
  telephone?: string;
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
  Date?: string;
  numero_facture?: string;
  societe_id?: number;
  societe?: Societe;
}

export interface Bill {
  id: number;
  user_id: number;
  numero_facture: string;
  montant_total: string;
  societe_id: number;
  status: string;
  Date: string;
  societe?: Societe;
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

export interface BillApiResponse {
  data: Bill[];
  message: string;
  status: number;
  links: any;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly TRANSACTIONS_API_URL = '/api/transactions';
  private readonly BILLS_API_URL = 'http://localhost:3005/my-bills';
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getTransactionsAndBills(): Observable<Transaction[]> {
    const transactionsObs = this.getTransactions();
    const billsObs = this.getBills();

    return forkJoin([transactionsObs, billsObs]).pipe(
      map(([transactionsResponse, billsResponse]) => {
        const transactions = transactionsResponse.data;
        const bills = billsResponse.data.map(bill => {
          const transaction: Transaction = {
            id: bill.id,
            montant: bill.montant_total,
            destinataire: null,
            agent: null,
            exp: null,
            type_id: 0,
            type: { id: 0, libelle: 'paiement' },
            users_transaction_destinataireTousers: null,
            users_transaction_agentTousers: null,
            users_transaction_expTousers: null,
            Date: bill.Date,
            numero_facture: bill.numero_facture,
            societe_id: bill.societe_id,
            societe: bill.societe // Inclure les informations de la société
          };
          return transaction;
        });

        return [...transactions, ...bills];
      })
    );
  }

  getTransactions(): Observable<ApiResponseList> {
    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${this.authService.getToken()}`
    );
    return this.http.get<ApiResponseList>(this.TRANSACTIONS_API_URL, { headers });
  }

  getBills(): Observable<BillApiResponse> {
    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${this.authService.getToken()}`
    );
    return this.http.get<BillApiResponse>(this.BILLS_API_URL, { headers });
  }

  getTransactionDetails(id: number): Observable<ApiResponseSingle> {
    const headers = new HttpHeaders().set(
      'Authorization', `Bearer ${this.authService.getToken()}`
    );
    return this.http.get<ApiResponseSingle>(`${this.TRANSACTIONS_API_URL}/${id}`, { headers });
  }

  getTransactionLabel(transaction: Transaction): string {
    const currentUser = this.authService.getUser();
    
    if (transaction.type.libelle === 'transfert') {
      if (transaction.exp === currentUser.id) {
        return `À ${transaction.users_transaction_destinataireTousers?.prenom} ${transaction.users_transaction_destinataireTousers?.nom}`;
      } else {
        return `De ${transaction.users_transaction_expTousers?.prenom} ${transaction.users_transaction_expTousers?.nom}`;
      }
    } else if (transaction.type.libelle === 'retrait') {
      return 'Retrait';
    } else if (transaction.type.libelle === 'depot') {
      return 'Dépôt';
    } else if (transaction.type.libelle === 'paiement') {
      // Afficher le nom de la société pour un paiement
      return `Paiement à ${transaction.societe?.nom}`;
    }else if (transaction.type.libelle === 'contribution') {
      return 'Contribution à une cagnotte';
    }else if (transaction.type.libelle === 'achatcredit') {
      return `Achat crédit`
    }
    return '';
  }

  getDetailLabel(transaction: Transaction): string {
    if (!transaction.Date) return '';
    
    return this.formatDate(transaction.Date);
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAmountClass(transaction: Transaction): string {
    const currentUser = this.authService.getUser();
    const isNegative = 
      transaction.type.libelle === 'retrait' || 
      transaction.type.libelle === 'paiement' ||
      (transaction.type.libelle === 'transfert' && transaction.exp === currentUser.id);
    return `text-lg font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`;
  }

  getAmountPrefix(transaction: Transaction): string {
    const currentUser = this.authService.getUser();
    const isNegative = 
      transaction.type.libelle === 'retrait' || 
      transaction.type.libelle === 'paiement' ||
      (transaction.type.libelle === 'transfert' && transaction.exp === currentUser.id);
    return isNegative ? '-' : '';
  }

  filterTransactions(transactions: Transaction[], searchTerm: string): Transaction[] {
    if (!searchTerm) return transactions;

    const searchTermLower = searchTerm.toLowerCase().trim();

    return transactions.filter(transaction => {
      // Search by transaction type
      if (transaction.type.libelle.toLowerCase().includes(searchTermLower)) return true;

      // Search by sender or recipient name, firstname, or additional details
      const exp = transaction.users_transaction_expTousers;
      const dest = transaction.users_transaction_destinataireTousers;
      const agent = transaction.users_transaction_agentTousers;

      const searchInUser = (user: User | null) => {
        if (!user) return false;
        return (
          (user.nom && user.nom.toLowerCase().includes(searchTermLower)) ||
          (user.prenom && user.prenom.toLowerCase().includes(searchTermLower)) ||
          (user.telephone && user.telephone.includes(searchTermLower))
        );
      };

      // Add bill-specific search
      if (transaction.type.libelle === 'paiement') {
        return (
          transaction.societe?.nom.toLowerCase().includes(searchTermLower) ||
          (transaction.numero_facture && transaction.numero_facture.includes(searchTermLower))
        );
      }

      return (
        searchInUser(exp) ||
        searchInUser(dest) ||
        searchInUser(agent)
      );
    });
  }

  getLast10Transactions(transactions: Transaction[]): Transaction[] {
    return transactions
      .sort((a, b) => {
        const dateA = new Date(a.Date || '').getTime();
        const dateB = new Date(b.Date || '').getTime();
        return dateB - dateA;
      })
      .slice(0, 10);
  }

  //chaque 2s vérifier le solde et actualiser le solde
}
