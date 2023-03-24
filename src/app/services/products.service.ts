import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpParams,
    HttpErrorResponse,
    HttpStatusCode
} from '@angular/common/http';
import {
    CreateProductDTO,
    Product,
    UpdateProductDTO
} from '../models/product.model';
import { retry, catchError, map } from 'rxjs/operators';
import { throwError, zip } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isNgTemplate } from '@angular/compiler';
import { checkTime } from './../interceptors/time.interceptor';

@Injectable({
    providedIn: 'root'
})
export class ProductsService {
    private apiUrl = `${environment.API_URL}/api`;

    constructor(private http: HttpClient) {}

    getByCategory(categoryId: string, limit?: number, offset?: number) {
        let params = new HttpParams();
        if (limit != undefined && offset != undefined) {
            params = params.set('limit', limit);
            params = params.set('offset', offset);
        }
        console.log('limit: ', limit, ' offset: ', offset);
        return this.http.get<Product[]>(
            `${this.apiUrl}/categories/${categoryId}/products`,
            { params }
        );
    }

    getAllProducts(limit?: number, offset?: number) {
        let params = new HttpParams();
        if (limit != undefined && offset != undefined) {
            params = params.set('limit', limit);
            params = params.set('offset', offset);
        }
        // return this.http.get<Product[]>('https://fakestoreapi.com/products');
        return this.http
            .get<Product[]>(`${this.apiUrl}/products`, {
                params,
                context: checkTime()
            })
            .pipe(
                retry(3),
                map(products =>
                    products.map(item => {
                        return {
                            ...item,
                            taxes: 0.19 * item.price
                        };
                    })
                )
            );
    }

    fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
        return zip(this.getOne(id), this.update(id, dto));
        // .subscribe(response => {
        //   const read = response[0];
        //   const update = response[1];
        // })
    }

    getOne(id: string) {
        return this.http.get<Product>(`${this.apiUrl}/products/${id}`).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === HttpStatusCode.Conflict) {
                    return throwError('Algo está fallando en el server');
                }
                if (error.status === HttpStatusCode.NotFound) {
                    return throwError('El producto no existe');
                }
                if (error.status === HttpStatusCode.Unauthorized) {
                    return throwError('No estás autorizado');
                }
                return throwError('Ups algo salio mal');
            })
        );
    }

    getProductsByPage(limit: number, offset: number) {
        return this.http.get<Product[]>(`${this.apiUrl}`, {
            params: { limit, offset }
        });
    }

    create(dto: CreateProductDTO) {
        return this.http.post<Product>(`${this.apiUrl}/products`, dto);
    }

    update(id: string, dto: UpdateProductDTO) {
        return this.http.put<Product>(`${this.apiUrl}/products/${id}`, dto);
    }

    delete(id: string) {
        return this.http.delete<boolean>(`${this.apiUrl}/products/${id}`);
    }
}
