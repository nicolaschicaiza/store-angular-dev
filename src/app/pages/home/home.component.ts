import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    limit = 10;
    offset = 0;
    myShoppingCart: Product[] = [];
    products: Product[] = [];
    productId: string | null = null;

    constructor(
        private storeService: StoreService,
        private productsService: ProductsService,
        private route: ActivatedRoute
    ) {
        this.myShoppingCart = this.storeService.getShoppingCart();
    }

    ngOnInit(): void {
        this.loadMore();
        this.route.queryParamMap.subscribe(params => {
            this.productId = params.get('product');
            console.log(this.productId);
        });
    }

    loadMore() {
        this.productsService
            .getAllProducts(this.limit, this.offset)
            .subscribe(data => {
                this.products = this.products.concat(data);
                this.offset += this.limit;
            });
    }
}
