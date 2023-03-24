import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Product } from '../../models/product.model';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent {
    @Input() product: Product = {
        id: '',
        title: '',
        images: [],
        price: 0,
        description: '',
        category: {
            id: 0,
            name: ''
        }
    };
    @Output() addedProduct = new EventEmitter<Product>();
    @Output() showProduct = new EventEmitter<string>();

    constructor() {}

    onAddToCart() {
        this.addedProduct.emit(this.product);
    }

    onShowDetail() {
        this.showProduct.emit(this.product.id);
    }
}
