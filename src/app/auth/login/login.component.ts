import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {UserControllerService} from '../../openapi-client';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'pm-login',
  imports: [
    FormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    ReactiveFormsModule,
    MatFormField,
    MatButton,
    MatInput,
    MatLabel,
    MatError,
    RouterLink

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  userControllerService = inject(UserControllerService);
  toastr = inject(ToastrService);
  router = inject(Router);

  errorMessage: string | null = null;

  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });



  // Login Formular absenden
  onSubmit() {
    this.errorMessage = null;

    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      this.toastr.warning('Bitte fülle alle Felder korrekt aus.', 'Warnung');
      return;
    }

    const formData = this.loginFormGroup.value;

    this.userControllerService.login({
      email: formData.email!,
      password: formData.password!,
    }).subscribe({
      next: (response) => {
        if (response.token) {
          console.log('Bearer Token:', response.token);

          localStorage.setItem('ACCESS_TOKEN', response.token);

          this.toastr.success('Login erfolgreich! Willkommen zurück.', 'Erfolg');


          this.router.navigate(['/general-sites/dashboard']);
        } else {
          this.errorMessage = 'Token fehlt in der API-Antwort.';
          this.toastr.error(this.errorMessage, 'Fehler');
          console.error('Token fehlt in der Antwort:', response);
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.';
        this.toastr.error(this.errorMessage ?? 'Unbekannter Fehler', 'Fehler');
        console.error('Fehler beim Login:', err);
      }
    });
  }
}
