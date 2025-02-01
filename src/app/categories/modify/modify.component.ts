import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CategoryControllerService, CategoryShowDto } from '../../openapi-client';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatCard} from '@angular/material/card';
import {ToastrService} from 'ngx-toastr';

/**
 * @component ModifyComponent
 * @description Ermöglicht das Erstellen und Bearbeiten von Kategorien.
 */
@Component({
  selector: 'pm-category-modify',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatButton,
    MatSelect,
    MatOption,
    MatCard,
  ],
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
})
export class ModifyComponent implements OnInit {
  categoryService = inject(CategoryControllerService);
  toastr = inject(ToastrService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    active: new FormControl(true, [Validators.required]),
  });

  isEdit = false;
  categoryId: number | null = null;


  /**
   * @method ngOnInit
   * @description Prüft, ob eine ID in der URL vorhanden ist (Bearbeitungsmodus) und lädt die Kategorie.
   */
  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.categoryId = Number(id);

      this.categoryService.getCategoryById(this.categoryId).subscribe({
        next: (category: CategoryShowDto) => {
          this.categoryForm.patchValue(category);
        },
        error: () => {
          this.toastr.error('Fehler beim Laden der Kategorie!', 'Fehler');
        },
      });
    }
  }

  /**
   * @method onSubmit
   * @description Speichert eine neue oder aktualisierte Kategorie.
   */
  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      this.toastr.warning('Bitte alle erforderlichen Felder ausfüllen!', 'Warnung');
      return;
    }

    const categoryData = {
      name: this.categoryForm.value.name ?? '',
      active: this.categoryForm.value.active ?? true,
    };

    if (this.isEdit && this.categoryId) {
      this.categoryService.updateCategoryById(this.categoryId, categoryData).subscribe({
        next: () => {
          this.toastr.success('Kategorie erfolgreich aktualisiert!', 'Erfolg');
          this.router.navigate(['/categories/list']);
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren:', err);
          this.toastr.error('Fehler beim Aktualisieren der Kategorie!', 'Fehler');
        },
      });
    } else {
      // Erstellt eine neue Kategorie
      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          this.toastr.success('Kategorie erfolgreich erstellt!', 'Erfolg');
          this.router.navigate(['/categories/list']);
        },
        error: (err) => {
          console.error('Fehler beim Erstellen:', err);
          this.toastr.error('Fehler beim Erstellen der Kategorie!', 'Fehler');
        },
      });
    }
  }
}
