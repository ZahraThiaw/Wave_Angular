// payment-modal.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, Society } from '../services/payment.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-payment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-modal.component.html'
})
export class PaymentModalComponent {
  @Input() society!: Society;
  @Output() close = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  numeroFacture: string = '';
  montant: number = 0;
  loading: boolean = false;
  error: string | null = null;
  showSuccessModal: boolean = false;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  processBillPayment() {
    if (!this.numeroFacture || !this.montant) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    const user = this.authService.getUser();
    const payload = {
      userId: user.id,
      numeroFacture: this.numeroFacture,
      montantTotal: this.montant,
      montantPaye: this.montant,
      societeId: this.society.id
    };

    this.loading = true;
    this.error = null;

    this.paymentService.processBillPayment(payload).subscribe({
      next: (response) => {
        if (response.status === 201) {
          this.showSuccessModal = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error processing payment:', error);
        this.error = 'Erreur lors du paiement. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.paymentSuccess.emit();
  }

  closeModal() {
    this.close.emit();
  }

  getSocietyIcon(secteur: string): string {
    return this.paymentService.getSocietyIcon(secteur);
  }
}