// credit-modal.component.ts
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditService, Client } from '../services/credit.service';

@Component({
  selector: 'app-credit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-modal.component.html',
  styleUrls: ['./credit-modal.component.css']
})
export class CreditModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  newNumber: string = '';
  selectedPhone: string = '';
  amount: number = 0;
  showError: boolean = false;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(public creditService: CreditService) {}

  ngOnInit() {
    this.loadClients();
  }

  private loadClients() {
    this.loading = true;
    this.creditService.getClients().subscribe({
      next: (response) => {
        this.clients = response.data;
        this.filterClients();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients:', error);
        this.errorMessage = 'Erreur lors du chargement des clients';
        this.loading = false;
      }
    });
  }

  filterClients() {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }

    const search = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.nom.toLowerCase().includes(search) ||
      client.prenom.toLowerCase().includes(search) ||
      client.telephone.includes(search)
    );
  }

  selectNumber(number: string) {
    if (this.creditService.isValidPhoneNumber(number)) {
      this.selectedPhone = number;
      this.showError = false;
    } else {
      this.showError = true;
    }
  }

  confirmPurchase() {
    if (this.selectedPhone && this.amount >= 100) {
      this.loading = true;
      this.creditService.purchaseCredit(this.selectedPhone, this.amount).subscribe({
        next: (response) => {
          this.loading = false;
          // Vous pouvez émettre un événement de succès ici si nécessaire
          this.close.emit();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erreur lors de l\'achat de crédit';
          console.error('Erreur lors de l\'achat de crédit:', error);
        }
      });
    }
  }
}