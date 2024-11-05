import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransactionService, Transaction } from '../services/transaction.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionDetailsComponent } from '../transaction-details/transaction-details.component';
import { Router } from '@angular/router';
import { NotificationService, Notification } from '../services/notification.service';
import { CagnotteModalComponent } from '../cagnotte-modal/cagnotte-modal.component';
import { PaymentComponent } from '../payment/payment.component';
import { TransferComponent } from '../transfer/transfer.component';
import { CreditModalComponent } from '../credit-modal/credit-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, TransactionDetailsComponent, CagnotteModalComponent, PaymentComponent, TransferComponent, CreditModalComponent],
  templateUrl: './home.component.html',
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class HomeComponent implements OnInit {
  protected Number = Number;  // Fix pour l'erreur
  
  allTransactions: Transaction[] = [];
  transactions: Transaction[] = [];
  user: any;
  showBalance: boolean = true;
  settingsVisible: boolean = false;
  selectedTransaction: Transaction | null = null;
  searchTerm: string = '';
  unreadNotifications: Notification[] = [];
  showNotifications: boolean = false;
  notificationCount: number = 0;
  showCagnotteModal = false;
  showPaymentModal = false;
  showTransferModal = false;
  showCreditModal = false;

  @Output() settingsToggle = new EventEmitter<void>();

  constructor(
    public transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.user = this.authService.getUser();
  }

  ngOnInit() {
    this.loadTransactionsAndBills();
    this.loadNotifications();
  }

  private loadNotifications() {
    if (this.user?.id) {
      this.notificationService.getUnreadNotifications(this.user.id).subscribe({
        next: (response) => {
          this.unreadNotifications = response.data;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      });
    }
  }

  toggleNotifications(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showNotifications = !this.showNotifications;
  }

  closeNotifications(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showNotifications = false;
  }

  private loadTransactionsAndBills() {
    this.transactionService.getTransactionsAndBills()
      .subscribe({
        next: (transactions) => {
          this.allTransactions = transactions;
          this.updateTransactionsList();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des transactions:', error);
        }
      });
  }

  onSearchTermChange() {
    this.updateTransactionsList();
  }

  private updateTransactionsList() {
    let filteredTransactions = this.transactionService.filterTransactions(
      this.allTransactions,
      this.searchTerm
    );
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

  toggleTransferModal() {
    this.showTransferModal = !this.showTransferModal;
  }

  togglePaymentModal() {
    this.showPaymentModal = !this.showPaymentModal;
  }

  toggleCagnotteModal() {
    this.showCagnotteModal = !this.showCagnotteModal;
  }

  toggleCreditModal() {
    this.showCreditModal = !this.showCreditModal;
  }
}
