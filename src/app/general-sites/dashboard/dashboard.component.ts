import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { UserControllerService, UserShowDto } from '../../openapi-client';

interface JwtPayload {
  email?: string;
  exp?: number;
}
@Component({
  selector: 'pm-dashboard',
  imports: [
    MatButton
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  router = inject(Router);
  userService = inject(UserControllerService);

  fullName: string = 'Benutzer';

  ngOnInit() {
    const token = localStorage.getItem('ACCESS_TOKEN');

    if (!token) {
      console.warn('Kein Token gefunden, Benutzer wird nicht geladen.');
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      if (decoded.email) {
        // Alle Benutzer abrufen und nach der E-Mail filtern
        this.userService.getAllUsers().subscribe({
          next: (users: UserShowDto[]) => {
            const user = users.find(u => u.email === decoded.email);
            if (user) {
              this.fullName = `${user.firstName} ${user.lastName}`;
            } else {
              console.warn('Benutzer nicht gefunden.');
              this.fullName = 'Unbekannter Benutzer';
            }
          },
          error: () => {
            console.error('Fehler beim Laden der Benutzerdaten.');
            this.fullName = 'Unbekannter Benutzer';
          }
        });
      }
    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      this.fullName = 'Unbekannter Benutzer';
    }
  }

  logout() {
    console.log('Benutzer meldet sich ab...');
    localStorage.removeItem('ACCESS_TOKEN'); // Token löschen
    localStorage.clear(); // Optional: Alle lokalen Daten entfernen
    this.router.navigate(['/auth/login']);
  }
}
