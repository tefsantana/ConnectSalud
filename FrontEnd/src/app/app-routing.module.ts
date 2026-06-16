import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './components/guard/auth.guard';
import { AdminGuard } from './components/guard/admin.guard';

import {
  InicioComponent,
  PlanesComponent,
  ContactoComponent,
  LoginComponent,
  RegisterComponent,
  TurnosComponent,
  CarritoComponent,
  ListCitasComponent,
  EditCitasComponent,
  PerfilComponent,
  ListUsersComponent,
  EditUsersComponent,
  PreguntasFrecuentesComponent,
  NuestroEquipoComponent,
  AdminTurnosComponent,
} from "./components/index.paginas"



const routes: Routes = [
    { path: 'inicio', component: InicioComponent },
    { path: 'planes', component: PlanesComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'preguntas-frecuentes', component: PreguntasFrecuentesComponent },
    { path: 'nuestro-equipo', component: NuestroEquipoComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'turnos', component: TurnosComponent, canActivate:[AuthGuard]},
    { path: 'carrito', component: CarritoComponent},
    { path: 'list-citas', component: ListCitasComponent, canActivate:[AuthGuard]},
    { path: 'edit-citas', component: EditCitasComponent, canActivate:[AuthGuard]},
    { path: 'edit/:id_paciente', component:EditCitasComponent, canActivate:[AuthGuard]},
    { path: 'perfil', component:PerfilComponent, canActivate:[AuthGuard]},
    { path: 'admin-turnos', component: AdminTurnosComponent, canActivate:[AuthGuard, AdminGuard]},
    { path: 'list-users', component: ListUsersComponent, canActivate:[AuthGuard, AdminGuard]},
    { path: 'edit-users', component: EditUsersComponent, canActivate:[AuthGuard, AdminGuard]},
    { path: 'edit-users/:id', component:EditUsersComponent, canActivate:[AuthGuard, AdminGuard]},
    { path: '**', pathMatch: 'full', redirectTo: 'inicio' },
];

export const app_routing = RouterModule.forRoot(routes, {
  useHash: true,
  anchorScrolling: 'enabled',
  scrollPositionRestoration: 'enabled'
});
