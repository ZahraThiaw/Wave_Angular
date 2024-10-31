// transaction-details.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransactionService, Transaction } from '../services/transaction.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {
  @Input() transaction!: Transaction;
  @Output() close = new EventEmitter<void>();

  constructor(
    private route: ActivatedRoute,
    private transactionService: TransactionService
  ) {}

  ngOnInit() {
    const transactionId = Number(this.route.snapshot.paramMap.get('id'));
    if (transactionId) {
      this.loadTransactionDetails(transactionId);
    }
  }

  private loadTransactionDetails(id: number) {
    this.transactionService.getTransactionDetails(id).subscribe(response => {
      this.transaction = response.data;
    });
  }

  onClose() {
    this.close.emit();
  }

  getTransactionColor(): string {
    const type = this.transaction.type.libelle;
    if (type === 'depot') return 'text-green-600';
    if (type === 'retrait') return 'text-red-600';
    return this.transactionService.getAmountClass(this.transaction);
  }

  getTransactionTitle(): string {
    return this.transactionService.getTransactionLabel(this.transaction);
  }

  formatAmount(amount: string): string {
    const prefix = this.transactionService.getAmountPrefix(this.transaction);
    return `${prefix}${amount}F`;
  }

  getMontantLabel(): string {
    switch (this.transaction.type.libelle) {
      case 'depot':
        return 'déposé';
      case 'retrait':
        return 'retiré';
      case 'transfert':
        return this.transaction.exp ? 'envoyé' : 'reçu';
      default:
        return '';
    }
  }

  getAgentName(): string | null {
    if (this.transaction.users_transaction_agentTousers) {
      return `${this.transaction.users_transaction_agentTousers.prenom} ${this.transaction.users_transaction_agentTousers.nom}`;
    }
    return null;
  }

  getTransferContact(): string | null {
    if (this.transaction.type.libelle === 'transfert') {
      const contact = this.transaction.exp ? 
        this.transaction.users_transaction_destinataireTousers :
        this.transaction.users_transaction_expTousers;
      
      if (contact) {
        return `${contact.prenom} ${contact.nom} ${contact.telephone || ''}`;
      }
    }
    return null;
  }
}