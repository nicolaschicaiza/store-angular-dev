import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { catchError, of, switchMap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = `${environment.API_URL}/api/auth`;

    constructor(
        private http: HttpClient
    ) { }

    login(email: string, password: string) {
        return this.http.post<Auth>(`${this.apiUrl}/login`, { email, password });
    }

    profile(token: string) {
        // const headers = new HttpHeaders();
        // headers.set('Authorization', `Bearer ${token}`);
        return this.http.get<User>(`${this.apiUrl}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                // 'Content-type': 'application/json'
            }
        });
    }

    loginAndGetProfile(email: string, password: string) {
        return this.login(email, password)
            // .pipe(
            //     catchError((error: HttpErrorResponse) => {
            //         if (error.status === HttpStatusCode.Conflict) {
            //             return throwError('Algo está fallando en el server');
            //         }
            //         if (error.status === HttpStatusCode.NotFound) {
            //             return throwError('El producto no existe');
            //         }
            //         if (error.status === HttpStatusCode.Unauthorized) {
            //             return throwError('No estás autorizado');
            //         }
            //         return throwError('Ups algo salio mal');
            //     }))
            .pipe(
                switchMap((auth) => {
                    console.log(auth.access_token);
                    const token = auth.access_token;
                    return this.profile(token)
                })
            );
    }
}
