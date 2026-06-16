import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/interfaces/user';
@Injectable({
  providedIn: 'root',
})
export class DataService {

  API_URL = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }

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

  private getHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Token ${token}`);
    }

    return headers;
  }

  listCitas(){
    return this.http.get<User>(this.API_URL + 'api/citas/', {
      headers: this.getHeaders(),
    });
  }

  listAdminCitas(filters: { profesional?: string; day?: number }) {
    let params = new HttpParams();

    if (filters.profesional) {
      params = params.set('profesional', filters.profesional);
    }

    if (filters.day) {
      params = params.set('day', String(filters.day));
    }

    return this.http.get<User>(this.API_URL + 'api/citas/admin/', {
      headers: this.getHeaders(),
      params,
    });
  }

  delCitas(id_paciente:any){
    return this.http.delete<User>(this.API_URL + 'api/citas/' + id_paciente, {
      headers: this.getHeaders(),
    });
  }

  AddCitas(data:any){
    return this.http.post<User>(this.API_URL + 'api/citas/' , data, {
      headers: this.getHeaders(),
    });
  }

  getCitas(id_paciente:any){
    return this.http.get<User>(this.API_URL + 'api/citas/' + id_paciente + '/', {
      headers: this.getHeaders(),
    });
  }

  editCitas(id_paciente:number, data:any){
    return this.http.put<User>(this.API_URL + 'api/citas/' + id_paciente + '/', data, {
      headers: this.getHeaders(),
    });
  }

  // Api edit-user

  getUser(id:any){
    return this.http.get<User>(this.API_URL + 'api/listusers/' + id + '/');
  }

  editUser(id:number, data:any){
    return this.http.put<User>(this.API_URL + 'api/listusers/' + id + '/', data);
  }
}
