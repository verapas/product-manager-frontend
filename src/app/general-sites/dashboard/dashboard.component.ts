import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'pm-dashboard',
  imports: [
    MatButton
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  router = inject(Router);

  // Einfacher Name für die Begrüßung
  fullName = localStorage.getItem('firstName') || 'Benutzer';

  logout() {
    localStorage.removeItem('fullName');
    this.router.navigate(['/auth/login']);
  }
}
