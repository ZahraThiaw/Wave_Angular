import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransactionService, Transaction } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionDetailsComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];
  user: any;
  showBalance: boolean = true;
  settingsVisible: boolean = false;
  selectedTransaction: Transaction | null = null;
  searchTerm: string = '';

  @Output() settingsToggle = new EventEmitter<void>();

  constructor(
    public transactionService: TransactionService,
    private authService: AuthService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.loadTransactions();
  }

  private loadTransactions() {
    this.transactionService.getTransactions()
      .subscribe(response => {
        this.allTransactions = response.data;
        this.updateTransactionsList();
      });
  }

  onSearchTermChange() {
    this.updateTransactionsList();
  }

  private updateTransactionsList() {
    // First, filter by search term
    let filteredTransactions = this.transactionService.filterTransactions(
      this.allTransactions, 
      this.searchTerm
    );

    // Then get the last 10
    this.transactions = this.transactionService.getLast10Transactions(filteredTransactions);
  }

  toggleBalance() {
    this.showBalance = !this.showBalance;
  }

  toggleSettingsPanel() {
    this.settingsVisible = !this.settingsVisible;
  }

  viewTransactionDetails(transaction: Transaction) {
    this.selectedTransaction = transaction;
  }
}