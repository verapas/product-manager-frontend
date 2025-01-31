import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProductControllerService, ProductDetailDto} from '../../openapi-client';
import {CurrencyPipe} from '@angular/common';
import {MatCard, MatCardActions} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';

@Component({
  selector: 'pm-detail',
  imports: [
    CurrencyPipe,
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
  productService = inject(ProductControllerService);

  product: ProductDetailDto | null = null;

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];

    this.productService.getProductById(id).subscribe({
      next: (product) => this.product = product,
      error: () => {
        this.toastr.error('Produkt nicht gefunden oder wurde gelöscht.', 'Fehler');
        this.router.navigate(['/products/list']);
      }
    });
  }
}
