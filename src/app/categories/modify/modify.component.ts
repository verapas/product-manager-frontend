import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CategoryControllerService, CategoryShowDto } from '../../openapi-client';
import {MatOption, MatSelect} from '@angular/material/select';

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
  ],
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
})
export class ModifyComponent implements OnInit {
  categoryService = inject(CategoryControllerService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    active: new FormControl(true, [Validators.required]),
  });

  isEdit = false;
  categoryId: number | null = null;

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.categoryService.getCategoryById(id).subscribe({
        next: (category: CategoryShowDto) => {
          this.categoryForm.patchValue(category);
          this.categoryId = category.id;
        },
        error: () => {
          console.error('Fehler beim Laden der Kategorie');
        },
      });
    }
  }

  onSubmit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }


    const categoryData = {
      name: this.categoryForm.value.name ?? '',
      active: this.categoryForm.value.active ?? true,
    };

    if (this.isEdit && this.categoryId) {

      this.categoryService.updateCategoryById(this.categoryId, categoryData).subscribe({
        next: () => {
          alert('Kategorie erfolgreich aktualisiert!');
          this.router.navigate(['/categories/list']);
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren:', err);
          alert('Fehler beim Aktualisieren der Kategorie.');
        },
      });
    } else {

      this.categoryService.createCategory(categoryData).subscribe({
        next: () => {
          alert('Kategorie erfolgreich erstellt!');
          this.router.navigate(['/categories/list']);
        },
        error: (err) => {
          console.error('Fehler beim Erstellen:', err);
          alert('Fehler beim Erstellen der Kategorie.');
        },
      });
    }
  }
}
