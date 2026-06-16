import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr);
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { app_routing } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { PlanesComponent } from './components/planes/planes.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './components/guard/auth.guard';
import { AdminGuard } from './components/guard/admin.guard';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ListCitasComponent } from './components/list-citas/list-citas.component';
import { EditCitasComponent } from './components/edit-citas/edit-citas.component';
import { TurnosComponent } from './components/turnos/turnos.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { DataService } from './components/services/data.service';
import { CartService } from './components/services/cart.service';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { PreguntasFrecuentesComponent } from './components/preguntas-frecuentes/preguntas-frecuentes.component';
import { NuestroEquipoComponent } from './components/nuestro-equipo/nuestro-equipo.component';
import { AdminTurnosComponent } from './components/admin-turnos/admin-turnos.component';
import { AuthService } from './components/services/auth.service';
import {AuthStateService} from './components/services/auth-state.service'
import { UserService } from './components/services/user.service';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    ContactoComponent,
    PlanesComponent,
    LoginComponent,
    RegisterComponent,
    CarritoComponent,
    ListCitasComponent,
    PerfilComponent,
    EditCitasComponent,
    TurnosComponent,
    ListUsersComponent,
    EditUsersComponent,
    PreguntasFrecuentesComponent,
    NuestroEquipoComponent,
    AdminTurnosComponent,
   ],
  imports: [
    BrowserModule,
    app_routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-AR' },
    AuthGuard,
    AdminGuard,
    DataService,
    CartService,
    AuthService,
    AuthStateService,
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
