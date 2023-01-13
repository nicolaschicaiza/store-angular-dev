import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  myShoppingCart: Product[] = [];
  total = 0;
  today = new Date();
  date = new Date(2023, 1, 12);
  products: Product[] = [
    // {
    //   id: '1',
    //   name: 'El mejor juguete',
    //   price: 565,
    //   image: './assets/images/toy.jpg'
    // },
    // {
    //   id: '2',
    //   name: 'Bicicleta casi nueva',
    //   price: 356,
    //   image: './assets/images/bike.jpg'
    // },
    // {
    //   id: '3',
    //   name: 'Colleción de albumnes',
    //   price: 34,
    //   image: './assets/images/album.jpg'
    // },
    // {
    //   id: '4',
    //   name: 'Mis libros',
    //   price: 23,
    //   image: './assets/images/books.jpg'
    // },
    // {
    //   id: '5',
    //   name: 'Casa para perro',
    //   price: 34,
    //   image: '../assets/images/house.jpg'
    // },
    // {
    //   id: '6',
    //   name: 'Gafas',
    //   price: 343,
    //   image: './assets/images/glasses.jpg'
    // }
  ]

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.productsService.getAllProduts()
      .subscribe(data => {
        this.products = data;
    })
  }

  onAddToShoppingCart(product: Product) {
    console.log(product);
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }
}
