import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @ViewChild('headerShell') headerShell?: ElementRef<HTMLElement>;

  mobileMenuOpen = false;
  isCompactHeader = false;
  loggedIn = false;
  isAdmin = false;
  private authSubscription?: Subscription;

    constructor( private authService: AuthService, private authStateService: AuthStateService, private userService: UserService, private router: Router )
{}

    ngOnInit() {
      const dpr = window.devicePixelRatio || 1;
      const normalizedWidth = dpr < 1 ? window.innerWidth * dpr : window.innerWidth;
      this.isCompactHeader = normalizedWidth <= 1200;
      this.loggedIn = this.authStateService.isUserLoggedIn();
      this.loadAdminState();
      this.authSubscription = this.authStateService.loggedIn$.subscribe((value) => {
        this.loggedIn = value;
        this.loadAdminState();
      });
    }

    ngAfterViewInit() {
	  setTimeout(() => this.updateResponsiveMode());
    }

    logout() {
      this.authService.logout();
      this.isAdmin = false;
}

    ngOnDestroy() {
      this.authSubscription?.unsubscribe();
    }

    toggleMobileMenu() {
      if (!this.isCompactHeader) {
        return;
      }
      this.mobileMenuOpen = !this.mobileMenuOpen;
    }

    closeMobileMenu() {
      this.mobileMenuOpen = false;
    }

    goToTeam(event: Event) {
      event.preventDefault();
      this.closeMobileMenu();

      const isOnInicio = this.router.url.includes('/inicio');

      if (isOnInicio) {
        this.scrollToTeamSectionWithRetry();
        return;
      }

      this.router.navigate(['/inicio']).then(() => this.scrollToTeamSectionWithRetry());
    }

    @HostListener('window:resize')
    onResize() {
      this.updateResponsiveMode();
    }

    private updateResponsiveMode() {
    const dpr = window.devicePixelRatio || 1;
    const normalizedWidth = dpr < 1 ? window.innerWidth * dpr : window.innerWidth;
    const viewportCompact = normalizedWidth <= 1200;
      const shell = this.headerShell?.nativeElement;
      const overflowCompact = !!shell && shell.scrollWidth > shell.clientWidth;
      const nextCompact = viewportCompact || overflowCompact;

      this.isCompactHeader = nextCompact;

      if (!nextCompact) {
        this.mobileMenuOpen = false;
      }
    }

    private scrollToTeamSectionWithRetry(attempt = 0) {
      const teamSection = document.getElementById('equipo');
      if (!teamSection) {
        if (attempt < 12) {
          setTimeout(() => this.scrollToTeamSectionWithRetry(attempt + 1), 80);
        }
        return;
      }

      const header = document.querySelector('.app-header') as HTMLElement | null;
      const offset = (header?.offsetHeight ?? 0) + 12;
      const targetY = teamSection.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth'
      });
    }

    private loadAdminState() {
      if (!this.loggedIn) {
        this.isAdmin = false;
        return;
      }

      const rawUser = localStorage.getItem('currentUser');
      if (rawUser) {
        try {
          const parsedUser = JSON.parse(rawUser);
          const storedUser = parsedUser?.user || {};
          if (storedUser?.is_staff || storedUser?.is_superuser) {
            this.isAdmin = true;
            return;
          }
        } catch {
          // Ignore parse errors and fallback to API check.
        }
      }

      this.userService.getUser().subscribe({
        next: (user) => {
          this.isAdmin = !!(user?.is_staff || user?.is_superuser);
        },
        error: () => {
          this.isAdmin = false;
        },
      });
    }
}
