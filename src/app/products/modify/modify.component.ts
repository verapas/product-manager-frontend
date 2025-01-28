import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { CategoryControllerService, CategoryShowDto, ProductControllerService } from '../../openapi-client';

@Component({
  selector: 'pm-modify',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatSelect,
    MatOption,
    MatButton,
  ],
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
})
export class ModifyComponent {
  categoryService = inject(CategoryControllerService);
  productService = inject(ProductControllerService);
  categories = signal<Array<CategoryShowDto>>([]);

  constructor() {
    this.categoryService.getAllCategories().subscribe((value) => {
      this.categories.set(value);
    });
  }

  productFormGroup = new FormGroup({
    sku: new FormControl('', [Validators.required, Validators.minLength(3)]),
    active: new FormControl(true, [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    image: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    category: new FormControl<number | undefined>(undefined, [Validators.required]),
  });

  onSubmit() {
    if (this.productFormGroup.valid) {
      const formData = this.productFormGroup.value;

      // API-Aufruf zum Erstellen eines Produkts
      this.productService
        .createProduct({
          sku: formData.sku!,
          active: formData.active!,
          name: formData.name!,
          image: formData.image!,
          description: formData.description!,
          price: formData.price!,
          stock: formData.stock!,
          categoryId: formData.category!,
        })
        .subscribe({
          next: (response) => {
            console.log('Produkt erfolgreich erstellt:', response);
            alert('Produkt erfolgreich erstellt!');
          },
          error: (err) => {
            console.error('Fehler beim Erstellen des Produkts:', err);
            alert('Fehler beim Erstellen des Produkts. Bitte versuchen Sie es erneut.');
          },
        });
    } else {
      console.error('Formular ungültig:', this.productFormGroup);
      this.productFormGroup.markAllAsTouched(); // Markiert alle Felder, um Fehler anzuzeigen
    }
  }
}
