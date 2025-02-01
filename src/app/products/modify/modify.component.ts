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
import {MatCard} from '@angular/material/card';
import {ToastrService} from 'ngx-toastr';

/**
 * @method ngOnInit
 * @description Lädt Kategorien und prüft, ob ein Produkt bearbeitet wird.
 */
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
    MatCard,
  ],
  templateUrl: './modify.component.html',
  styleUrls: ['./modify.component.scss'],
})
export class ModifyComponent implements OnInit {
  categoryService = inject(CategoryControllerService);
  productService = inject(ProductControllerService);
  toastr = inject(ToastrService);
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
  pageTitle = 'Produkt Erstellen';

  /**
   * @method ngOnInit
   * @description Lädt Kategorien und prüft, ob ein Produkt bearbeitet wird.
   * Falls ein Produkt bearbeitet wird, werden die bestehenden Daten ins Formular geladen.
   */
  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((value) => {
      this.categories.set(value);
    });

    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.productId = Number(id);
      this.pageTitle = 'Produkt Bearbeiten';

      // Produktdaten abrufen und ins Formular laden
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
          this.toastr.error('Fehler beim Laden des Produkts!', 'Fehler');
        },
      });
    }
  }

  /**
   * @method onSubmit
   * @description Erstellt oder aktualisiert ein Produkt je nach Bearbeitungsmodus.
   */
  onSubmit() {
    if (this.productFormGroup.invalid) {
      this.productFormGroup.markAllAsTouched();
      this.toastr.warning('Bitte alle erforderlichen Felder ausfüllen!', 'Warnung');
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
          this.toastr.success('Produkt erfolgreich aktualisiert!', 'Erfolg');
          this.router.navigate(['/products/list']);
        },
        error: (err) => {
          console.error('Fehler beim Aktualisieren:', err);
          this.toastr.error('Fehler beim Aktualisieren des Produkts!', 'Fehler');
        },
      });
    } else {
      // Neues Produkt erstellen
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.toastr.success('Produkt erfolgreich erstellt!', 'Erfolg');
          this.router.navigate(['/products/list']);
        },
        error: (err) => {
          console.error('Fehler beim Erstellen:', err);
          this.toastr.error('Fehler beim Erstellen des Produkts!', 'Fehler');
        },
      });
    }
  }
}
