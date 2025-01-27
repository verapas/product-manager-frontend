import { Component } from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {RouterLink} from '@angular/router';

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

  loginFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    if (this.loginFormGroup.valid) {
      console.log(this.loginFormGroup.value);
      // Todo web request an den server
    } else {
      console.error('Formular ist ungültig');
      console.log(this.loginFormGroup);
    }
  }
}
