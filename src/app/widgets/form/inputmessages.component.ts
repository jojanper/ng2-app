import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';


class ValidationMessages {
    static getMessage(validatorName: string, validatorValue?: any) {
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

    if (this.control.touched) {
        for (let propertyName in this.control.errors) {
            if (this.control.errors.hasOwnProperty(propertyName)) {
                errors.push(ValidationMessages.getMessage(propertyName, this.control.errors[propertyName]));
            }
        }
    }

    return errors;
  }
}
