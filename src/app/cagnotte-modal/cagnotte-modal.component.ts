import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CagnotteService, Cagnotte } from '../services/cagnotte.service';

@Component({
  selector: 'app-cagnotte-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cagnotte-modal.component.html',
  styles: []
})
export class CagnotteModalComponent {
  @Input() userBalance: number = 0;
  @Output() close = new EventEmitter<void>();
  
  cagnottes: Cagnotte[] = [];
  showCreateForm = false;
  showContribution = false;
  showSuccessModal = false;
  selectedCagnotte: Cagnotte | null = null;
  contributionAmount: number = 0;
  newCagnotte = {
    nom: '',
    montant_objectif: 0
  };

  constructor(private cagnotteService: CagnotteService) {
    this.loadCagnottes();
  }

  Number(value: string): number {
    return Number(value);
  }

  get maxContribution(): number {
    return Math.min(
      this.userBalance,
      this.selectedCagnotte ? 
        Number(this.selectedCagnotte.montant_objectif) - Number(this.selectedCagnotte.montant) : 
        0
    );
  }

  private loadCagnottes() {
    this.cagnotteService.getOpenCagnottes().subscribe({
      next: (response) => {
        this.cagnottes = response.data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des cagnottes:', error);
      }
    });
  }

  selectCagnotte(cagnotte: Cagnotte) {
    this.selectedCagnotte = cagnotte;
    this.showContribution = true;
  }

  createCagnotte() {
    if (this.newCagnotte.nom && this.newCagnotte.montant_objectif > 0) {
      this.cagnotteService.createCagnotte(this.newCagnotte).subscribe({
        next: () => {
          this.showCreateForm = false;
          this.loadCagnottes();
          this.newCagnotte = { nom: '', montant_objectif: 0 };
        },
        error: (error) => {
          console.error('Erreur lors de la création de la cagnotte:', error);
        }
      });
    }
  }

  contribute() {
    if (this.selectedCagnotte && this.contributionAmount > 0 && this.contributionAmount <= this.maxContribution) {
      this.cagnotteService.contribute(this.selectedCagnotte.id, this.contributionAmount).subscribe({
        next: () => {
          this.showSuccessModal = true;
        },
        error: (error) => {
          console.error('Erreur lors de la contribution:', error);
        }
      });
    }
  }

  closeSuccessAndReload() {
    this.showSuccessModal = false;
    this.close.emit();
  }

  backToList() {
    this.showContribution = false;
    this.showCreateForm = false;
    this.selectedCagnotte = null;
    this.contributionAmount = 0;
    this.loadCagnottes();
  }
}