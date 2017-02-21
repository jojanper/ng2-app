import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


class ValidationService {
    static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
        let config = {
            'required': 'Required',
            'minlength': `Minimum length ${validatorValue.requiredLength}`,
            'maxlength': `Maximum length ${validatorValue.requiredLength}`
        };

        return config[validatorName];
    }
}

@Component({
  selector: 'dng2-form-input-messages',
  template: `<div *ngFor="let msg of errorMessage" class="form-control-feedback">{{ msg }}</div>`
})

export class FormInputMessagesComponent {

  @Input() control: FormControl;

  get errorMessage() {
    let errors = [];

    for (let propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
            errors.push(ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]));
        }
    }

    return errors;
  }
}
