// transfer-modal.component.ts
import { Component, EventEmitter, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TransferService, User } from '../services/transfer.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  contacts: User[] = [];
  filteredContacts: User[] = [];
  selectedContact: User | null = null;
  searchTerm: string = '';
  transferAmount: number | null = null;
  userSolde: string = '0';
  successMessage: string = '';
  errorMessage: string = '';
  private transferSub?: Subscription;
  loading: boolean = false;

  constructor(
    private transferService: TransferService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadContacts();
    this.loadUserBalance();
  }

  ngOnDestroy() {
    if (this.transferSub) {
      this.transferSub.unsubscribe();
    }
  }

  loadContacts() {
    this.loading = true;
    this.transferService.getClients().subscribe({
      next: (response) => {
        this.contacts = response.data;
        this.filteredContacts = this.contacts;
      },
      error: (err) => {
        this.errorMessage = 'Impossible de charger les contacts';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadUserBalance() {
    const user = this.authService.getUser();
    this.userSolde = user.solde;
  }

  filterContacts() {
    if (!this.searchTerm.trim()) {
      this.filteredContacts = this.contacts;
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredContacts = this.contacts.filter(contact => 
      contact.nom.toLowerCase().includes(searchTermLower) ||
      contact.prenom.toLowerCase().includes(searchTermLower) ||
      contact.telephone.includes(searchTermLower)
    );
  }

  selectContact(contact: User) {
    this.selectedContact = contact;
    this.errorMessage = '';
  }

  getMaxAmount(): number {
    return parseFloat(this.userSolde);
  }

  getSoldeNumber(): number {
    return parseFloat(this.userSolde);
  }

  isAmountValid(): boolean {
    if (!this.transferAmount) return false;
    return this.transferAmount > 0 && 
           this.transferAmount <= this.getMaxAmount() && 
           this.transferAmount >= 100;
  }

  canTransfer(): boolean {
    return !!(
      this.selectedContact && 
      this.transferAmount && 
      this.isAmountValid() &&
      !this.loading
    );
  }

  performTransfer() {
    if (!this.canTransfer() || !this.selectedContact || !this.transferAmount) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.transferSub = this.transferService
      .performTransfer(this.transferAmount, this.selectedContact.telephone)
      .subscribe({
        next: (response) => {
          this.successMessage = response.status;
          this.authService.updateUserBalance(response.data.sender.solde);
          
          setTimeout(() => {
            this.close.emit();
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Échec du transfert';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}