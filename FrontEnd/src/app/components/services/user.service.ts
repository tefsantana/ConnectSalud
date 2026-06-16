import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class UserService {


    api_url = 'http://127.0.0.1:8000/';

    constructor(private http: HttpClient) {}

    private getAuthToken(): string {
        const directToken = localStorage.getItem('token');
        if (directToken) {
            return directToken;
        }

        const rawUser = localStorage.getItem('currentUser');
        if (!rawUser) {
            return '';
        }

        try {
            const parsedUser = JSON.parse(rawUser);
            return parsedUser?.token || '';
        } catch {
            return '';
        }
    }

    getHeaders() {
        const token = this.getAuthToken();
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });

        if (token) {
            headers = headers.set('Authorization', `Token ${token}`);
        }

        return headers;
    }

    getUser() {
        return this.http.get<any>(this.api_url + 'api/user/', {
            headers: this.getHeaders(),
        });
    }


updateProfile(profileData: any): Observable<any> {
    return this.http.put<any>(this.api_url + 'api/user/', profileData, {
        headers: this.getHeaders(),
    });
    }

deleteOwnAccount(): Observable<any> {
    return this.http.delete<any>(this.api_url + 'api/user/', {
        headers: this.getHeaders(),
    });
}
}
