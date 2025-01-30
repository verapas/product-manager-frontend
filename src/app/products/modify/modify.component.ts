import {Component, inject, OnInit, signal} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import {
  CategoryControllerService,
  CategoryShowDto,
  ProductControllerService, ProductDetailDto,
} from '../../openapi-client';
import {ActivatedRoute, Router} from '@angular/router';

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
export class ModifyComponent implements OnInit {
  categoryService = inject(CategoryControllerService);
  productService = inject(ProductControllerService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  categories = signal<Array<CategoryShowDto>>([]);

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

  isEdit = false;
  productId: number | null = null;

  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((value) => {
      this.categories.set(value);
    });

    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.productId = Number(id);

      // Produktdaten aus der API laden und Formular befüllen
      this.productService.getProductById(this.productId).subscribe({
        next: (product: ProductDetailDto) => {
          this.productFormGroup.patchValue({
            sku: product.sku,
            active: product.active,
            name: product.name,
            image: product.image,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category?.id,
          });
        },
        error: () => {
          console.error('Fehler beim Laden des Produkts');
        },
      });
    }
  }

  onSubmit() {
    if (this.productFormGroup.invalid) {
      this.productFormGroup.markAllAsTouched();
      return;
    }

    const formData = {
      sku: this.productFormGroup.value.sku!,
      active: this.productFormGroup.value.active!,
      name: this.productFormGroup.value.name!,
      image: this.productFormGroup.value.image!,
      description: this.productFormGroup.value.description!,
      price: this.productFormGroup.value.price!,
      stock: this.productFormGroup.value.stock!,
      categoryId: this.productFormGroup.value.category!,
    };

    if (this.isEdit && this.productId) {
      // Update bestehendes Produkt
      this.productService.updateProductById(this.productId, formData).subscribe({
        next: () => {
          alert('Produkt erfolgreich aktualisiert!');
          this.router.navigate(['/products/list']);
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren:', err);
          alert('Fehler beim Aktualisieren des Produkts.');
        },
      });
    } else {
      // Neues Produkt erstellen
      this.productService.createProduct(formData).subscribe({
        next: () => {
          alert('Produkt erfolgreich erstellt!');
          this.router.navigate(['/products/list']);
        },
        error: (err) => {
          console.error('Fehler beim Erstellen:', err);
          alert('Fehler beim Erstellen des Produkts.');
        },
      });
    }
  }
}
