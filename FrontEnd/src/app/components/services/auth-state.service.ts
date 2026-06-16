import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private readonly TOKEN_KEY = 'token';
  private loggedInSubject = new BehaviorSubject<boolean>(this.hasActiveSession());
  readonly loggedIn$ = this.loggedInSubject.asObservable();

  constructor() {
    this.syncFromStorage();
  }

  setLoggedIn(value: boolean) {
    if (value) {
      if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', 'true');
      }
    } else {
      localStorage.removeItem('currentUser');
    }

    this.loggedInSubject.next(value);
  }

  syncFromStorage() {
    this.loggedInSubject.next(this.hasActiveSession());
  }

  isUserLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getLoggedInStatus(): boolean {
    return this.loggedInSubject.value;
  }

  clearSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedInSubject.next(false);
  }

  private hasActiveSession(): boolean {
    return !!localStorage.getItem('currentUser');
  }
}
