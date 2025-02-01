import {Component, inject, OnInit, signal} from '@angular/core';
import {UserControllerService, UserShowDto} from '../../openapi-client';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {MatCard} from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';

/**
 * @component ListComponent
 * @description Zeigt eine Liste aller Benutzer und ermöglicht die Beförderung von Benutzern zu Administratoren.
 */
@Component({
  selector: 'pm-list',
  imports: [
    MatCard,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  userService = inject(UserControllerService);
  toastr = inject(ToastrService);
  router = inject(Router);
  users = signal<Array<UserShowDto>>([]);

  displayedColumns: string[] = ['email', 'isAdmin', 'actions'];

  /**
   * @method ngOnInit
   * @description Wird beim Laden der Komponente aufgerufen und ruft die Benutzerliste ab.
   */
  ngOnInit() {
    this.loadUsers();
  }

  /**
   * @method loadUsers
   * @description Ruft alle Benutzer aus der API ab und speichert sie in `users`.
   */
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (userList) => {
        this.users.set(userList);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Benutzer:', err);
        this.toastr.error('Fehler beim Laden der Benutzer.', 'Fehler');
      },
    });
  }

  /**
   * @method promoteToAdmin
   * @description Befördert einen Benutzer nach Bestätigung zum Administrator.
   * @param userId Die ID des Benutzers, der befördert werden soll.
   */
  promoteToAdmin(userId: number) {
    if (confirm('Möchtest du diesen Benutzer wirklich zum Admin befördern?')) {
      this.userService.promoteUser(userId).subscribe({
        next: () => {
          this.toastr.success('Benutzer erfolgreich zum Admin befördert!', 'Erfolg');
          this.loadUsers(); // Liste neu laden
        },
        error: (err) => {
          console.error('Fehler bei der Beförderung:', err);
          this.toastr.error('Fehler beim Befördern zum Admin.', 'Fehler');
        },
      });
    }
  }
}
