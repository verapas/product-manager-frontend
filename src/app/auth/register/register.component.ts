import { Component } from '@angular/core';
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
import { RouterLink } from '@angular/router';

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

    this.registerFormGroup.markAllAsTouched();

    if (this.registerFormGroup.invalid) {
      return;
    }

    console.log('Formular gesendet:', this.registerFormGroup.value);
  }
}
