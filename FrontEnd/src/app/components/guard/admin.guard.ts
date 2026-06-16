import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): Observable<boolean> {
    const rawUser = localStorage.getItem('currentUser');
    if (!rawUser) {
      this.router.navigate(['/login']);
      return of(false);
    }

    return this.userService.getUser().pipe(
      map((user) => {
        const isAdmin = !!(user?.is_staff || user?.is_superuser);
        if (!isAdmin) {
          this.router.navigate(['/inicio']);
        }
        return isAdmin;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
