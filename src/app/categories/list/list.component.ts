import {Component, inject, OnInit, signal} from '@angular/core';
import {CategoryControllerService, CategoryShowDto} from '../../openapi-client';
import {ToastrService} from 'ngx-toastr';
import {Router, RouterLink} from '@angular/router';
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
 * @description Zeigt eine Liste aller Kategorien in einer Tabelle an.
 * Ermöglicht das Bearbeiten und Löschen von Kategorien.
 */
@Component({
  selector: 'pm-list',
  imports: [
    MatCard,
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCellDef,
    MatCell,
    MatHeaderCellDef,
    MatButton,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    RouterLink
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  categoryService = inject(CategoryControllerService);
  toastr = inject(ToastrService);
  router = inject(Router);
  categories = signal<Array<CategoryShowDto>>([]);

  displayedColumns: string[] = ['name', 'active', 'actions'];

  /**
   * @method ngOnInit
   * @description Lädt die Kategorienliste beim Initialisieren der Komponente.
   */
  ngOnInit() {
    this.loadCategories();
  }

  /**
   * @method loadCategories
   * @description Ruft alle Kategorien aus der API ab und speichert sie in `categories`.
   */
  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (categoryList) => {
        console.log('Geladene Kategorien:', categoryList); // Debugging
        this.categories.set(categoryList);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Kategorien:', err);
        this.toastr.error('Fehler beim Laden der Kategorien.', 'Fehler');
      },
    });
  }

  /**
   * @method editCategory
   * @description Weiterleitung zur Bearbeitungsseite einer Kategorie.
   * @param categoryId Die ID der zu bearbeitenden Kategorie.
   */
  editCategory(categoryId: number) {
    this.router.navigate(['/categories/edit', categoryId]);
  }

  /**
   * @method deleteCategory
   * @description Löscht eine Kategorie nach Bestätigung und lädt die Liste neu.
   * @param categoryId Die ID der zu löschenden Kategorie.
   */
  deleteCategory(categoryId: number) {
    if (confirm('Möchtest du diese Kategorie wirklich löschen?')) {
      this.categoryService.deleteCategoryById(categoryId).subscribe({
        next: () => {
          this.toastr.success('Kategorie erfolgreich gelöscht!', 'Erfolg');
          this.loadCategories(); // Liste neu laden
        },
        error: (err) => {
          console.error('Fehler beim Löschen:', err);
          this.toastr.error('Fehler beim Löschen der Kategorie.', 'Fehler');
        },
      });
    }
  }
}
