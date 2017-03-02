import { Component, Input } from '@angular/core';

import { FormBaseInputComponent } from './base.input.component';


@Component({
  selector: 'dng2-default-input',
  template: require('./default.input.component.html')
})

/**
 * Default form input component.
 */
export class FormDefaultInputComponent extends FormBaseInputComponent {
    @Input() type = 'text';
}
