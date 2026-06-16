import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { DataService } from '../services/data.service';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-admin-turnos',
  templateUrl: './admin-turnos.component.html',
  styleUrls: ['./admin-turnos.component.css']
})
export class AdminTurnosComponent implements OnInit {
  appointments: any[] = [];
  professionals: string[] = [];
  selectedProfessional = '';
  selectedDay = '';
  loading = true;
  isAdmin = false;
  errorMessage = '';

  constructor(
    private userService: UserService,
    private dataService: DataService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.loadProfessionals();
    this.verifyAdminAndLoad();
  }

  private loadProfessionals(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (team) => {
        this.professionals = (team || []).map((member) => member.name);
      },
      error: () => {
        this.professionals = [];
      },
    });
  }

  private verifyAdminAndLoad(): void {
    this.loading = true;
    this.userService.getUser().subscribe({
      next: (user) => {
        this.isAdmin = !!(user?.is_staff || user?.is_superuser);

        if (!this.isAdmin) {
          this.loading = false;
          this.errorMessage = 'No tenés permisos de administrador para ver este panel.';
          return;
        }

        this.fetchAppointments();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No pudimos validar tus permisos. Iniciá sesión nuevamente.';
      },
    });
  }

  applyFilters(): void {
    if (!this.isAdmin) {
      return;
    }

    this.fetchAppointments();
  }

  clearFilters(): void {
    this.selectedProfessional = '';
    this.selectedDay = '';
    this.applyFilters();
  }

  private fetchAppointments(): void {
    this.loading = true;
    this.errorMessage = '';

    const dayNumber = Number(this.selectedDay);
    const day = Number.isInteger(dayNumber) && dayNumber >= 1 && dayNumber <= 31 ? dayNumber : undefined;

    this.dataService.listAdminCitas({
      profesional: this.selectedProfessional || undefined,
      day,
    }).subscribe({
      next: (response: any) => {
        this.appointments = Array.isArray(response) ? response : [];
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.appointments = [];

        if (error?.status === 403) {
          this.errorMessage = 'Acceso denegado: solo administradores pueden consultar todos los turnos.';
          return;
        }

        this.errorMessage = error?.error?.detail || 'No pudimos cargar los turnos en este momento.';
      },
    });
  }
}
