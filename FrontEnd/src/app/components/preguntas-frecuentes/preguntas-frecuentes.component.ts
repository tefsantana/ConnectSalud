import { Component } from '@angular/core';

@Component({
  selector: 'app-preguntas-frecuentes',
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrls: ['./preguntas-frecuentes.component.css']
})
export class PreguntasFrecuentesComponent {
  faqs = [
    {
      question: '¿Cómo solicito un turno desde la plataforma?',
      answer: 'Ingresá en la sección Turnos, elegí una especialidad y horario disponible. Luego confirmá la reserva en un solo paso.'
    },
    {
      question: '¿Puedo reprogramar o cancelar mi turno?',
      answer: 'Sí. Desde tu perfil podés gestionar tus turnos activos, reprogramar fecha u horario y cancelar cuando lo necesites.'
    },
    {
      question: '¿Qué incluye cada plan de salud?',
      answer: 'Cada plan define consultas, nivel de seguimiento y canales de contacto. Podés compararlos en la pantalla de Planes.'
    },
    {
      question: '¿Cómo me contacto con soporte?',
      answer: 'Podés escribir desde Contacto o comunicarte por teléfono de lunes a viernes de 9:00 a 18:00 hs.'
    }
  ];
}
