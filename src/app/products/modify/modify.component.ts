import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'pm-modify',
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatError,
    MatSelect,
    MatOption,
    MatButton
  ],
  templateUrl: './modify.component.html',
  styleUrl: './modify.component.scss'
})
export class ModifyComponent {

  productFormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    category: new FormControl<number | undefined>(undefined, []),
  })

  onSubmit() {
    if (this.productFormGroup.valid) {
      // Todo web request an den server
    } else {
      console.error("Formular invalid");
      console.log(this.productFormGroup)
    }
  }
}
