import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactService } from '../services/contact.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  formData = {
    name: '',
    lastName: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  };

  isSubmitting = false;
  submitMessage = '';
  submitError = false;

  constructor(private contactService: ContactService) {}

  onSubmit(form: NgForm): void {
    if (this.isSubmitting) {
      return;
    }

    if (form.invalid) {
      form.control.markAllAsTouched();
      this.submitError = true;
      this.submitMessage = 'Revisa los campos obligatorios antes de enviar.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;
    this.submitMessage = '';

    const payload = { ...this.formData };

    this.contactService.sendMessage(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitError = false;
        this.submitMessage = 'Mensaje enviado correctamente. Te responderemos pronto.';

        this.formData = {
          name: '',
          lastName: '',
          phone: '',
          email: '',
          subject: '',
          message: ''
        };

        form.resetForm(this.formData);
      },
      error: () => {
        this.isSubmitting = false;
        this.submitError = true;
        this.submitMessage = 'No pudimos enviar tu mensaje. Intenta nuevamente en unos minutos.';
      }
    });
  }

}
