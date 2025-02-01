import {Component, inject, OnInit, signal} from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {Router, RouterLink} from '@angular/router';
import {jwtDecode} from 'jwt-decode';

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

  ngOnInit() {
    this.checkAdminStatus();
  }

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
