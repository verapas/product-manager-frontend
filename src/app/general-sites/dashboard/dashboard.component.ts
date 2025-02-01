import { Component, inject, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { MatButton } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { UserControllerService, UserShowDto } from '../../openapi-client';
import {MatCard} from '@angular/material/card';

interface JwtPayload {
  email?: string;
  exp?: number;
  roles?: string[];
}

@Component({
  selector: 'pm-dashboard',
  imports: [
    MatButton,
    RouterLink,
    MatCard
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  router = inject(Router);
  userService = inject(UserControllerService);

  fullName: string = 'Benutzer';
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  // Beim Laden des Dashboards prüfen, ob der Benutzer eingeloggt ist und Admin-Rechte hat
  ngOnInit() {
    const token = localStorage.getItem('ACCESS_TOKEN');

    if (!token) {
      console.warn('Kein Token gefunden.');
      return;
    }

    this.isLoggedIn = true;

    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      if (decoded.roles?.includes('admin')) {
        this.isAdmin = true;
      }

      if (decoded.email) {
        // Benutzer anhand der E-Mail suchen
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

  // Benutzer abmelden und zur Login-Seite weiterleiten
  logout() {
    console.log('Benutzer meldet sich ab...');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}
