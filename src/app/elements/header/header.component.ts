import {Component, inject, OnInit, signal} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {Router, RouterLink} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

/**
 * @component HeaderComponent
 * @description Stellt die Navigationsleiste bereit und prüft, ob der Benutzer Adminrechte hat.
 */
@Component({
  selector: 'pm-header',
  imports: [
    MatToolbar,
    MatButton,
    MatMenuTrigger,
    MatMenu,
    RouterLink,
    MatMenuItem
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  router = inject(Router);
  isAdmin = signal<boolean>(false);

  /**
   * @method ngOnInit
   * @description Wird beim Laden des Headers ausgeführt und prüft, ob der Benutzer Adminrechte hat.
   */
  ngOnInit() {
    this.checkAdminStatus();
  }

  /**
   * @method checkAdminStatus
   * @description Prüft den Admin-Status anhand des JWT-Tokens im LocalStorage.
   * Falls das Token gültig ist und der Benutzer Adminrechte hat, wird `isAdmin` gesetzt.
   */
  checkAdminStatus() {
    const token = localStorage.getItem('ACCESS_TOKEN');

    if (!token) {
      this.isAdmin.set(false);
      return;
    }

    try {
      const decoded: any = jwtDecode(token);

      const isAdmin = decoded.roles?.includes('admin');
      this.isAdmin.set(isAdmin);

    } catch (error) {
      console.error('Fehler beim Dekodieren des Tokens:', error);
      this.isAdmin.set(false);
    }
  }
}
