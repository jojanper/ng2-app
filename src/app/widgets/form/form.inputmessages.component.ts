import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ValidationMessages } from './form.validators';


@Component({
  selector: 'dng-form-input-messages',
  template: `<div *ngFor="let msg of errorMessage" class="form-control-feedback">{{ msg }}</div>`
})
/**
 * Handle error messages corresponding to specified input control.
 */
export class FormInputMessagesComponent {

  @Input() control: FormControl;

  get errorMessage() {
    let errors = [];

    if (this.control.touched) {
        console.log(this.control);
        console.log(this.control.parent.errors);
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName)) {
                errors.push(ValidationMessages.getMessage(propertyName, this.control.errors[propertyName]));
            }
        }
    }

    return errors;
  }
}
