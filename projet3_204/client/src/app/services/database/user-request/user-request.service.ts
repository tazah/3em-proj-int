import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from './../../../../../../common/user/user';
@Injectable({
    providedIn: 'root',
})
export class UserRequestService {
    userList: User[] = [];
    USER_ROUTE: string = 'http://localhost:3000/api/user/';
    constructor(private http: HttpClient) {
        this.userList = [];
    }

    addNewUser(newUser: User): Observable<number | User> {
        return this.http.post<number | User>(this.USER_ROUTE + 'addNewUser', newUser).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    getUser(username: string): Observable<number | User> {
        return this.http.get<User>(this.USER_ROUTE + 'getUser/' + username);
    }
}
