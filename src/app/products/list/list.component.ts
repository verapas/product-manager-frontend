import {Component, inject, OnInit, signal} from '@angular/core';
import {ProductControllerService, ProductShowDto} from '../../openapi-client';
import {Router, RouterLink} from '@angular/router';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {CurrencyPipe} from '@angular/common';
import {MatCard} from '@angular/material/card';
import {ToastrService} from 'ngx-toastr';

/**
 * @method ngOnInit
 * @description Wird beim Laden der Komponente ausgeführt und ruft die Produktliste ab.
 */
@Component({
  selector: 'pm-list',
  imports: [
    MatTable,
    MatHeaderCell,
    MatColumnDef,
    MatCell,
    MatButton,
    MatHeaderRow,
    MatRow,
    RouterLink,
    CurrencyPipe,
    MatCard,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  productService = inject(ProductControllerService);
  toastr = inject(ToastrService);
  router = inject(Router);
  products = signal<Array<ProductShowDto>>([]);

  displayedColumns: string[] = ['name', 'price', 'stock', 'actions'];

  /**
   * @method ngOnInit
   * @description Lädt die Produktliste beim Initialisieren der Komponente.
   */
  ngOnInit() {
    this.loadProducts();
  }

  /**
   * @method loadProducts
   * @description Holt alle Produkte aus der API und speichert sie in `products`.
   */
  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (productList) => {
        this.products.set(productList);
      },
      error: (err) => {
        console.error('Fehler beim Laden der Produkte:', err);
        this.toastr.error('Fehler beim Laden der Produktliste.', 'Fehler');
      },
    });
  }

  /**
   * @method editProduct
   * @description Leitet zur Bearbeitungsseite eines Produkts weiter.
   * @param productId Die ID des zu bearbeitenden Produkts.
   */
  editProduct(productId: number) {
    this.router.navigate(['/products/edit', productId]);
  }

  /**
   * @method deleteProduct
   * @description Löscht ein Produkt nach Bestätigung und lädt die Liste neu.
   * @param productId Die ID des zu löschenden Produkts.
   */
  deleteProduct(productId: number) {
    if (confirm('Möchtest du dieses Produkt wirklich löschen?')) {
      this.productService.deleteProductById(productId).subscribe({
        next: () => {
          this.toastr.success('Produkt erfolgreich gelöscht!', 'Erfolg');
          this.loadProducts(); // Liste neu laden
        },
        error: (err) => {
          console.error('Fehler beim Löschen:', err);
          this.toastr.error('Fehler beim Löschen des Produkts.', 'Fehler');
        },
      });
    }
  }
}
