import {Component, inject} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup, ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import {Router, RouterLink} from '@angular/router';
import {UserControllerService} from '../../openapi-client';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'pm-register',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatFormField,
    MatCardActions,
    MatButton,
    MatInput,
    ReactiveFormsModule,
    MatError,
    MatLabel,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userControllerService = inject(UserControllerService);
  router = inject(Router);

  errorMessage: string | null = null; // Für dynamische Fehlermeldungen

  registerFormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]),
    street: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]),
    city: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.maxLength(15)]),
    mobilePhone: new FormControl('', [Validators.maxLength(15)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$')
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl): Validators | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsDoNotMatch: true }
      : null;
  }

  onSubmit() {
    this.errorMessage = null; // Fehlermeldung zurücksetzen
    this.registerFormGroup.markAllAsTouched();

    if (this.registerFormGroup.invalid) {
      return;
    }

    const formData = this.registerFormGroup.value;

    this.userControllerService.register({
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      street: formData.street!,
      zip: formData.zip!,
      city: formData.city!,
      country: formData.country!,
      phone: formData.phone!,
      mobilePhone: formData.mobilePhone!,
      email: formData.email!,
      password: formData.password!,
    }).subscribe({
      next: () => {
        // Bei Erfolg Weiterleitung zum Login
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        // Fehlermeldung speichern
        this.errorMessage = err.error?.message || 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
      }
    });
  }
}
