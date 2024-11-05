import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService, Society } from '../services/payment.service';
import { PaymentModalComponent } from '../payment-modal/payment-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, PaymentModalComponent],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  societies: Society[] = [];
  selectedSociety: Society | null = null;
  loading: boolean = false;
  error: string | null = null;

  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadSocieties();
  }

  loadSocieties() {
    this.loading = true;
    this.paymentService.getSocieties().subscribe({
      next: (response) => {
        this.societies = response.data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading societies:', error);
        this.error = 'Erreur lors du chargement des sociétés';
        this.loading = false;
      }
    });
  }

  selectSociety(society: Society) {
    this.selectedSociety = society;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getSocietyIcon(secteur: string): string {
    return this.paymentService.getSocietyIcon(secteur);
  }

  handlePaymentSuccess() {
    this.close.emit();
  }

  closeModal() {
    this.selectedSociety = null;
  }
}