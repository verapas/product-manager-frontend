import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CategoryControllerService, CategoryDetailDto} from '../../openapi-client';
import {MatCard, MatCardActions} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';

/**
 * @component DetailComponent
 * @description Zeigt die Details einer Kategorie basierend auf der übergebenen ID.
 * Falls die Kategorie nicht gefunden wird, erfolgt eine Weiterleitung zur Kategorienliste.
 */
@Component({
  selector: 'pm-detail',
  imports: [
    MatCard,
    MatButton,
    MatList,
    MatListItem,
    MatCardActions
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);
  categoryService = inject(CategoryControllerService);
  category: CategoryDetailDto | null = null;

  /**
   * @method ngOnInit
   * @description Lädt die Kategorie anhand der ID aus der URL.
   * Falls die Kategorie nicht gefunden wird, erfolgt eine Fehlermeldung und Weiterleitung.
   */
  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.categoryService.getCategoryById(id).subscribe({
      next: (category) => this.category = category,
      error: () => {
        this.toastr.error('Kategorie nicht gefunden oder wurde gelöscht.', 'Fehler');
        this.router.navigate(['/categories/list']);
      }
    });
  }
}
