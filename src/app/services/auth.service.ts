import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpStatusCode
} from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.API_URL}/api/auth`;
    private user = new BehaviorSubject<User | null>(null);
    user$ = this.user.asObservable(); // El simbolo $ dentro del nombre de una variable significa que es un Observador

    constructor(private http: HttpClient, private tokenService: TokenService) {}

    // login(email: string, password: string) {
    //     return this.http.post<Auth>(`${this.apiUrl}/login`, {
    //         email,
    //         password
    //     });
    // }

    // profile(token: string) {
    //     // const headers = new HttpHeaders();
    //     // headers.set('Authorization', `Bearer ${token}`);
    //     return this.http.get<User>(`${this.apiUrl}/profile`, {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //             // 'Content-type': 'application/json'
    //         }
    //     });
    // }

    // loginAndGetProfile(email: string, password: string) {
    //     return (
    //         this.login(email, password)
    //             // .pipe(
    //             //     catchError((error: HttpErrorResponse) => {
    //             //         if (error.status === HttpStatusCode.Conflict) {
    //             //             return throwError('Algo está fallando en el server');
    //             //         }
    //             //         if (error.status === HttpStatusCode.NotFound) {
    //             //             return throwError('El producto no existe');
    //             //         }
    //             //         if (error.status === HttpStatusCode.Unauthorized) {
    //             //             return throwError('No estás autorizado');
    //             //         }
    //             //         return throwError('Ups algo salio mal');
    //             //     }))
    //             .pipe(
    //                 switchMap(auth => {
    //                     console.log(auth.access_token);
    //                     const token = auth.access_token;
    //                     return this.profile(token);
    //                 })
    //             )
    //     );
    // }

    // Nueva API
    login(email: string, password: string) {
        return this.http
            .post<Auth>(`${this.apiUrl}/login`, { email, password })
            .pipe(
                tap(response => {
                    console.log(response);
                    this.tokenService.saveToken(response.access_token);
                })
            );
    }

    getProfile(): Observable<User> {
        return this.http
            .get<User>(`${this.apiUrl}/profile`, {
                headers: {
                    Authorization: `Bearer ${this.tokenService.getToken()}`
                    // 'Content-type': 'application/json'
                }
            })
            .pipe(tap(user => this.user.next(user))); // Tap realiza una acción una vez obtiene el perfil
    }

    loginAndGet(email: string, password: string) {
        return this.login(email, password).pipe(
            switchMap(() => this.getProfile())
        );
    }

    logout() {
        this.tokenService.removeToken();
    }
}
