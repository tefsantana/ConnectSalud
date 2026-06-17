import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { TeamService } from '../services/team.service';

interface AvailabilityDay {
  date: string;
  label: string;
  available: number;
  total: number;
}

@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css'],
})
export class TurnosComponent implements OnInit {
  angForm: FormGroup;
  availabilityDays: AvailabilityDay[] = [];
  timeSlots: string[] = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
  professionals: string[] = [];
  appointments: any[] = [];
  occupiedSlots = new Set<string>();
  selectedDate = '';
  bookingError = '';

  get selectedDateLabel(): string {
    const day = this.availabilityDays.find((item) => item.date === this.selectedDate);
    return day?.label || 'Sin día seleccionado';
  }

  constructor(
    @Inject(FormBuilder) private fb: FormBuilder,
    private dataService: DataService,
    private teamService: TeamService,
    private route: Router)
    {
    this.angForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^\d{7,8}$/)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{1,10}$/)]],
      correo: ['', Validators.required],
      profesional: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      mensaje: [''],
    });

    this.angForm.get('profesional')?.valueChanges.subscribe(() => {
      this.buildAvailabilityDays();
      this.updateOccupiedSlots();
      this.bookingError = '';
    });

    this.angForm.get('fecha')?.valueChanges.subscribe((date) => {
      this.selectedDate = date || '';
      this.updateOccupiedSlots();
      this.bookingError = '';
    });

    this.angForm.get('hora')?.valueChanges.subscribe(() => {
      this.bookingError = '';
    });
  }

  ngOnInit(): void {
    this.loadProfessionals();
    this.loadAppointments();
  }

  private loadProfessionals(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (team) => {
        this.professionals = (team || []).map((member) => member.name);
        if (this.professionals.length > 0 && !this.angForm.get('profesional')?.value) {
          this.angForm.patchValue({ profesional: this.professionals[0] });
        }
      },
      error: () => {
        this.professionals = [
          'Lic. Carla Gómez',
          'Lic. Marianela Flores',
          'Lic. Yanella Tobares',
        ];
        if (!this.angForm.get('profesional')?.value) {
          this.angForm.patchValue({ profesional: this.professionals[0] });
        }
      },
    });
  }

  private getSelectedProfessional(): string {
    return (this.angForm.get('profesional')?.value || '').trim();
  }

  private loadAppointments(): void {
    this.dataService.listCitas().subscribe((data: any) => {
      this.appointments = Array.isArray(data) ? data : [];
      this.buildAvailabilityDays();

      if (!this.selectedDate) {
        const firstAvailableDay = this.availabilityDays.find((day) => day.available > 0);
        if (firstAvailableDay) {
          this.selectDay(firstAvailableDay.date);
        }
      }
    });
  }

  private buildAvailabilityDays(): void {
    const today = new Date();
    this.availabilityDays = [];

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isoDate = this.toIsoDate(date);
      const occupiedCount = this.getOccupiedSlotsForDate(isoDate).size;

      this.availabilityDays.push({
        date: isoDate,
        label: this.formatDateLabel(date),
        total: this.timeSlots.length,
        available: Math.max(0, this.timeSlots.length - occupiedCount),
      });
    }
  }

  private toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('es-AR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  }

  private normalizeTime(timeValue: string): string {
    if (!timeValue) {
      return '';
    }

    const [hours = '00', minutes = '00'] = timeValue.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  private getOccupiedSlotsForDate(date: string): Set<string> {
    const slots = new Set<string>();

    this.appointments
      .filter((item) => item.fecha === date)
      .forEach((item) => slots.add(this.normalizeTime(item.hora)));

    return slots;
  }

  private updateOccupiedSlots(): void {
    this.occupiedSlots = this.selectedDate ? this.getOccupiedSlotsForDate(this.selectedDate) : new Set<string>();

    const selectedSlot = this.normalizeTime(this.angForm.get('hora')?.value || '');
    if (!selectedSlot || this.occupiedSlots.has(selectedSlot)) {
      this.angForm.patchValue({ hora: '' }, { emitEvent: false });
    }
  }

  selectDay(date: string): void {
    this.selectedDate = date;
    this.angForm.patchValue({ fecha: date });
    this.updateOccupiedSlots();

    const currentSlot = this.normalizeTime(this.angForm.get('hora')?.value || '');
    if (!currentSlot) {
      const firstAvailableSlot = this.timeSlots.find((slot) => !this.isSlotOccupied(slot));
      if (firstAvailableSlot) {
        this.selectSlot(firstAvailableSlot);
      }
    }
  }

  selectSlot(slot: string): void {
    if (!this.selectedDate || this.isSlotOccupied(slot)) {
      return;
    }

    this.angForm.patchValue({ hora: slot }, { emitEvent: true });
    this.angForm.get('hora')?.markAsDirty();
    this.angForm.get('hora')?.markAsTouched();
  }

  isSlotOccupied(slot: string): boolean {
    return this.occupiedSlots.has(slot);
  }

  isSelectedSlot(slot: string): boolean {
    return this.normalizeTime(this.angForm.get('hora')?.value || '') === slot;
  }

  postdata(data: any) {
    if (this.angForm.get('dni')?.invalid) {
      this.bookingError = 'El DNI debe tener 7 u 8 digitos numericos.';
      this.angForm.get('dni')?.markAsTouched();
      return;
    }

    if (this.angForm.get('telefono')?.invalid) {
      this.bookingError = 'El telefono debe tener hasta 10 digitos numericos.';
      this.angForm.get('telefono')?.markAsTouched();
      return;
    }

    if (this.angForm.invalid) {
      this.angForm.markAllAsTouched();
      this.bookingError = 'Completá todos los campos obligatorios para reservar.';
      return;
    }

    const selectedSlot = this.normalizeTime(this.angForm.get('hora')?.value || '');
    const selectedProfessional = this.getSelectedProfessional();
    if (!this.selectedDate || !selectedSlot) {
      this.bookingError = 'Seleccioná una fecha y un horario disponible.';
      return;
    }

    if (!selectedProfessional) {
      this.bookingError = 'Seleccioná una profesional para continuar.';
      return;
    }

    if (this.isSlotOccupied(selectedSlot)) {
      this.bookingError = 'Ese horario ya fue reservado. Elegí otro disponible.';
      return;
    }

    const payload = {
      ...this.angForm.value,
      profesional: selectedProfessional,
      mensaje: (this.angForm.get('mensaje')?.value || '').trim() || 'Sin mensaje',
    };

    this.bookingError = '';
    this.dataService.AddCitas(payload).subscribe({
      next: (createdAppointment: any) => {
        this.appointments = [...this.appointments, createdAppointment || payload];
        this.buildAvailabilityDays();
        this.updateOccupiedSlots();
        this.route.navigate(['list-citas']);
      },
      error: (error) => {
        const errorData = error?.error;
        const firstFieldError =
          errorData && typeof errorData === 'object'
            ? Object.values(errorData).find((value: any) => Array.isArray(value) && value.length > 0)
            : null;

        const backendMessage =
          errorData?.hora?.[0] ||
          (Array.isArray(firstFieldError) ? firstFieldError[0] : null) ||
          errorData?.detail;

        this.bookingError = backendMessage || 'No pudimos completar la reserva. Intenta nuevamente.';
        this.loadAppointments();
      }
    });
  }
}
