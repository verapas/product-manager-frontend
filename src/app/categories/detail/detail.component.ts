import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {CategoryControllerService, CategoryDetailDto} from '../../openapi-client';
import {MatCard, MatCardActions} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';

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

  // Lädt die Kategorie beim aufruf der Detailseite
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
