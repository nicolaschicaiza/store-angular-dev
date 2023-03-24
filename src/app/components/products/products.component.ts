import { Component, EventEmitter, Input, Output } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import {
    CreateProductDTO,
    Product,
    UpdateProductDTO
} from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/products.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
    myShoppingCart: Product[] = [];
    total = 0;
    @Input() products: Product[] = [];
    // @Input() ProductId: string | null = null;
    @Input() set productId(id: string | null) {
        if (id) {
            this.onShowDetail(id);
        }
    }
    @Output() loadMore: EventEmitter<string> = new EventEmitter<string>();
    today = new Date();
    date = new Date(2023, 1, 12);
    // products: Product[] = [
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
    // ];
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
    statusDetail: 'loading' | 'success' | 'error' | 'init' = 'init';

    constructor(
        private storeService: StoreService,
        private productsService: ProductsService
    ) {
        this.myShoppingCart = this.storeService.getShoppingCart();
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
        this.statusDetail = 'loading';
        //en caso de que den dos veces al botón solo ocultara los detalles(para no ir a darle al botón de cerrar)
        if (
            this.product.id != '' &&
            this.product.id == id &&
            this.showProductDetail == true
        ) {
            this.showProductDetail = false;
            return;
        }

        //en caso de que seleccionen el mismo producto ya no hay necesidad de hacer la petición de nuevo y solo vuelve a mostrar el panel
        if (
            this.product.id != '' &&
            this.product.id == id &&
            this.showProductDetail == false
        ) {
            this.showProductDetail = true;
            return;
        }
        //en caso que le den al botón de ver detalles mientras ya están abiertos los de un producto diferente cierra el panel de detalles
        if (
            this.product.id != '' &&
            this.product.id != id &&
            this.showProductDetail == true
        ) {
            this.showProductDetail = false;
        }

        this.toggleProductDetail();
        this.productsService.getOne(id).subscribe(
            data => {
                this.product = data;
                if (!this.showProductDetail) {
                    this.statusDetail = 'success';
                }
            },
            errorMsg => {
                window.alert(errorMsg);
                console.error(errorMsg);
                this.statusDetail = 'error';
            }
        );
    }

    readAndUpdate(id: string) {
        this.productsService
            .getOne(id)
            .pipe(
                // para depender una de otra usar switchMap
                switchMap(product =>
                    this.productsService.update(product.id, { title: 'change' })
                )
            )
            .subscribe(data => {
                console.log(data);
                // const product = data;
                // this.productsService.update(product.id, { title: 'change' })
                //   .subscribe(rtaUpdate => {
                //     console.log(rtaUpdate);
                //   })
            });
        // para ejecutar todo en paralelo usar zip, sin embargo lo recomendable es que esta
        // lógica se coloque directamente en el servicio con el fin de reutilizar en otro componente
        // zip(

        //   this.productsService.getProduct(id),
        //   this.productsService.update(id, { title: 'nuevo' })
        // )
        //   .subscribe(response => {
        //     const read = response[0];
        //     const update = response[1];
        //   })
        this.productsService
            .fetchReadAndUpdate(id, { title: 'change' })
            .subscribe(response => {
                const read = response[0];
                const update = response[1];
            });
    }

    createNewProduct() {
        // Para esta API se utiliza un Data Transfer Object (DTO) diferente al Modelo, por tanto se crea el DTO
        const product: CreateProductDTO = {
            title: 'Nuevo Producto',
            description: 'Una descripción',
            images: [
                `https://placeimg.com/640/480/any?random=${Math.random()}`
            ],
            price: 200,
            categoryId: 2
        };
        this.productsService.create(product).subscribe(data => {
            console.log('created', data);
            this.products.unshift(data);
        });
    }

    updateProduct() {
        const changes: UpdateProductDTO = {
            title: 'Nuevo título'
        };
        const id = this.product.id;
        this.productsService.update(id, changes).subscribe(data => {
            console.log('updated', data);
            this.product = data;
            this.products = this.products.map(item => {
                if (item.id === data.id) {
                    return data;
                }
                return item;
            });
            // const productIndex = this.products.findIndex(item => item.id === this.product.id);
            // this.products[productIndex] = data;
        });
    }

    deleteProduct() {
        const id = this.product.id;
        this.productsService.delete(id).subscribe(() => {
            const productIndex = this.products.findIndex(
                item => item.id === this.product.id
            );
            this.products.splice(productIndex, 1);
            this.showProductDetail = false;
        });
    }

    onLoadMore() {
        this.loadMore.emit();
    }
}
