import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService, TeamMember } from '../services/team.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  loading = true;

  constructor(private teamService: TeamService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment === 'equipo') {
        this.scrollToTeamSection();
      }
    });

    this.teamService.getTeamMembers().subscribe({
      next: (data) => {
        this.teamMembers = data;
        this.loading = false;

        if (this.route.snapshot.fragment === 'equipo') {
          this.scrollToTeamSection();
        }
      },
      error: (err) => {
        console.error('Error loading team members:', err);
        this.loading = false;
      }
    });
  }

  private scrollToTeamSection(attempt = 0): void {
    const teamSection = document.getElementById('equipo');
    if (!teamSection) {
      if (attempt < 10) {
        setTimeout(() => this.scrollToTeamSection(attempt + 1), 80);
      }
      return;
    }

    const header = document.querySelector('.app-header') as HTMLElement | null;
    const offset = (header?.offsetHeight ?? 0) + 12;
    const top = teamSection.getBoundingClientRect().top + window.pageYOffset - offset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  }
}
