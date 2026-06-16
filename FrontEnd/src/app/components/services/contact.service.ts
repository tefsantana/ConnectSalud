import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactPayload {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8000/api/contact/';

  constructor(private http: HttpClient) {}

  sendMessage(payload: ContactPayload): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(this.apiUrl, payload);
  }
}
