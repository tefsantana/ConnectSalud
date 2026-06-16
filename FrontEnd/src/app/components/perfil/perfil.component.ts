import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthStateService } from '../services/auth-state.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})

export class PerfilComponent implements OnInit {
  profile: any;
  private profileSnapshot: any;
  isLoading: boolean = false;
  updateSuccess: boolean = false;
  updateError: boolean = false;
  editing: boolean = false;
  profileErrorMessage = '';
  deletingAccount = false;

  constructor(
    private userService: UserService,
    private authStateService: AuthStateService
  ) { }

  ngOnInit(): void {
   this.loadProfile();
}

  loadProfile(): void {
   this.isLoading = true;
   this.profileErrorMessage = '';
   this.userService.getUser().subscribe(
     response => {
       this.profile = response;
       this.profileSnapshot = { ...response };
       this.isLoading = false;
     },
     error => {
       this.profile = null;
       if (error?.status === 401 || error?.status === 403) {
         this.authStateService.clearSession();
         this.profileErrorMessage = 'Tu sesión no es válida o expiró. Inicia sesión nuevamente.';
       } else {
         this.profileErrorMessage = 'No pudimos cargar el perfil en este momento. Intenta nuevamente.';
       }
       this.isLoading = false;
     }
  );
}


updateProfile(): void {
  this.isLoading = true;
  this.updateSuccess = false;
  this.updateError = false;

  this.userService.updateProfile(this.profile).subscribe(
    response => {
    this.profile = response;
    this.isLoading = false;
    this.updateSuccess = true;
   },
   error => {
     console.log(error);
     this.isLoading = false;
     this.updateError = true;
   }
  );
}

startEdit(): void {
  this.updateSuccess = false;
  this.updateError = false;
  this.editing = true;
}

cancelEdit(): void {
  if (this.profileSnapshot) {
    this.profile = { ...this.profileSnapshot };
  }
  this.updateSuccess = false;
  this.updateError = false;
  this.editing = false;
}

saveChanges(): void {
  this.isLoading = true;
  this.updateSuccess = false;
  this.updateError = false;
  this.userService.updateProfile(this.profile).subscribe(
response => {
  this.profile = response;
  this.profileSnapshot = { ...response };
  this.isLoading = false;
  this.updateSuccess = true;
  this.editing = false; // Salir del modo de edición después de guardar los cambios
},
error => {
  console.log(error);
  this.isLoading = false;
  this.updateError = true;
   }
  );
 }

deleteOwnAccount(): void {
  const confirmed = window.confirm('Esta acción eliminará tu cuenta de forma permanente. ¿Deseas continuar?');
  if (!confirmed) {
    return;
  }

  this.deletingAccount = true;
  this.userService.deleteOwnAccount().subscribe({
    next: () => {
      this.authStateService.clearSession();
    },
    error: () => {
      this.deletingAccount = false;
      this.updateError = true;
      this.profileErrorMessage = 'No pudimos eliminar tu cuenta en este momento.';
    },
    complete: () => {
      this.deletingAccount = false;
    },
  });
}
}
