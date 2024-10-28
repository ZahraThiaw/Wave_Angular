import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HomeComponent, SettingsComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {}
