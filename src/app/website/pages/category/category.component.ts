import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-category',
    template: `
        <app-products
            [productId]="productId"
            [products]="products"
            (loadMore)="loadMore()"
        ></app-products>
    `,
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, AfterViewInit {
    limit = 10;
    offset = 0;
    categoryId: string | null = null;
    products: Product[] = [];
    productId: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService
    ) {}

    ngOnInit(): void {
        this.route.paramMap
            .pipe(
                switchMap(params => {
                    this.categoryId = params.get('id');
                    this.offset = 0;
                    if (this.categoryId) {
                        return this.productsService.getByCategory(
                            this.categoryId,
                            this.limit,
                            this.offset
                        );
                    }
                    return [];
                })
            )
            .subscribe(data => {
                this.products = data;
                this.offset += this.limit;
            });
    }

    ngAfterViewInit(): void {
        this.route.queryParamMap.subscribe(params => {
            this.productId = params.get('product');
            console.log(this.productId);
        });
    }

    loadMore() {
        if (this.categoryId) {
            return this.productsService
                .getByCategory(this.categoryId, this.limit, this.offset)
                .subscribe(data => {
                    this.products = this.products.concat(data);
                    this.offset += this.limit;
                });
        }
        return [];
    }
}
