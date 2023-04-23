import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';

import SwiperCore, { Navigation, Pagination } from 'swiper/core';
SwiperCore.use([Navigation, Pagination]);

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
    productId: string | null = null;
    product: Product | null = null;
    imagesUrl: any;

    constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService,
        private router: Router,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.route.paramMap
            .pipe(
                switchMap(params => {
                    this.productId = params.get('id');
                    if (this.productId) {
                        return this.productsService.getOne(this.productId);
                    }
                    return [null];
                })
            )
            .subscribe(data => {
                this.product = data;
                this.imagesUrl = this.product?.images;
            });
    }

    goToHome() {
        this.router.navigateByUrl('/home');
    }
}
