import { Component, OnInit } from '@angular/core';
import { CreateProductDTO, Product, UpdateProductDTO } from 'src/app/models/product.model';
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
  showProductDetail = false;
  product: Product = {
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
  limit = 10;
  offset = 0;

  constructor(
    private storeService: StoreService,
    private productsService: ProductsService
  ) {
    this.myShoppingCart = this.storeService.getShoppingCart();
  }

  ngOnInit(): void {
    this.loadMore();
  }

  onAddToShoppingCart(product: Product) {
    console.log(product);
    this.storeService.addProduct(product);
    this.total = this.storeService.getTotal();
  }

  toggleProductDetail() {
    this.showProductDetail = !this.showProductDetail;
  }

  onShowDetail(id: string) {
    //en caso de que den dos veces al botón solo ocultara los detalles(para no ir a darle al botón de cerrar)
    if (this.product.id != '' && this.product.id == id && this.showProductDetail == true) {
      this.showProductDetail = false;
      return;
    }

    //en caso de que seleccionen el mismo producto ya no hay necesidad de hacer la petición de nuevo y solo vuelve a mostrar el panel
    if (this.product.id != '' && this.product.id == id && this.showProductDetail == false) {
      this.showProductDetail = true;
      return;
    }
    //en caso que le den al botón de ver detalles mientras ya están abiertos los de un producto diferente cierra el panel de detalles
    if (this.product.id != '' && this.product.id != id && this.showProductDetail == true) {
      this.showProductDetail = false;
    }

    this.productsService.getProduct(id)
      .subscribe(data => {
        this.product = data;
        if (!this.showProductDetail) {
          this.toggleProductDetail();
        }

      });
  }

  createNewProduct() {
    // Para esta API se utiliza un Data Transfer Object (DTO) diferente al Modelo, por tanto se crea el DTO
    const product: CreateProductDTO = {
      title: 'Nuevo Producto',
      description: 'Una descripción',
      images: [`https://placeimg.com/640/480/any?random=${Math.random()}`],
      price: 200,
      categoryId: 2
    }
    this.productsService.create(product)
      .subscribe(data => {
        console.log('created', data)
        this.products.unshift(data)
      })
  }

  updateProduct() {
    const changes: UpdateProductDTO = {
      title: 'Nuevo título'
    };
    const id = this.product.id;
    this.productsService.update(id, changes)
      .subscribe(data => {
        console.log('updated', data);
        this.product = data;
        this.products = this.products.map((item) => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        })
        // const productIndex = this.products.findIndex(item => item.id === this.product.id);
        // this.products[productIndex] = data;
      })
  }

  deleteProduct() {
    const id = this.product.id;
    this.productsService.delete(id)
      .subscribe(() => {
        const productIndex = this.products.findIndex(item => item.id === this.product.id);
        this.products.splice(productIndex, 1);
        this.showProductDetail = false;
      });
  }

  loadMore() {
    this.productsService.getAllProducts(this.limit, this.offset)
      .subscribe(data => {
        this.products = this.products.concat(data);
        this.offset += this.limit;
    })
  }
}
