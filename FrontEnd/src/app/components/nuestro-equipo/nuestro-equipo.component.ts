import { Component, OnInit } from '@angular/core';
import { TeamService, TeamMember } from '../services/team.service';

interface TeamMemberExtended extends TeamMember {
  bio?: string;
  especialidad?: string;
  expanded?: boolean;
}

const BIOS: Record<string, { bio: string; especialidad: string }> = {
  'Lic. Carla Gomez': {
    especialidad: 'Nutrición clínica y deportiva',
    bio: 'Licenciada en Nutrición con más de 10 años de experiencia en nutrición clínica y deportiva. Especializada en planes alimentarios personalizados para adultos y deportistas de alto rendimiento. Docente universitaria y autora de artículos científicos en revistas de nutrición.',
  },
  'Lic. Carla Gómez': {
    especialidad: 'Nutrición clínica y deportiva',
    bio: 'Licenciada en Nutrición con más de 10 años de experiencia en nutrición clínica y deportiva. Especializada en planes alimentarios personalizados para adultos y deportistas de alto rendimiento. Docente universitaria y autora de artículos científicos en revistas de nutrición.',
  },
  'Lic. Marianela Flores': {
    especialidad: 'Nutrición pediátrica y familiar',
    bio: 'Licenciada en Nutrición con orientación en nutrición pediátrica y familiar. Especialista en el abordaje integral de la alimentación en todas las etapas del ciclo vital, con foco en la educación alimentaria y la prevención de enfermedades crónicas desde la infancia.',
  },
  'Lic. Yanella Tobares': {
    especialidad: 'Nutrición y salud mental',
    bio: 'Licenciada en Nutrición con posgrado en psiconutrición. Trabaja el vínculo entre alimentación, emociones y comportamiento, brindando un enfoque compasivo y sin dietas restrictivas. Especialista en trastornos de la conducta alimentaria y alimentación consciente.',
  },
};

@Component({
  selector: 'app-nuestro-equipo',
  templateUrl: './nuestro-equipo.component.html',
  styleUrls: ['./nuestro-equipo.component.css'],
})
export class NuestroEquipoComponent implements OnInit {
  members: TeamMemberExtended[] = [];
  loading = true;
  error = '';

  constructor(private teamService: TeamService) {}

  ngOnInit(): void {
    this.teamService.getTeamMembers().subscribe({
      next: (data) => {
        this.members = data.map((m) => ({
          ...m,
          ...(BIOS[m.name] ?? {
            especialidad: 'Especialista en nutrición',
            bio: 'Profesional de la salud con amplia trayectoria en el acompañamiento nutricional.',
          }),
          expanded: false,
        }));
        this.loading = false;
      },
      error: () => {
        this.error = 'No pudimos cargar el equipo. Intenta nuevamente más tarde.';
        this.loading = false;
      },
    });
  }

  toggle(member: TeamMemberExtended): void {
    member.expanded = !member.expanded;
  }
}
