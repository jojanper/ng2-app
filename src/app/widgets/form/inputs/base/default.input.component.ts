import { Component, Input } from '@angular/core';

import { FormBaseInputComponent } from './base.input.component';


@Component({
  selector: 'dng-default-input',
  templateUrl: './default.input.component.html',
  styleUrls: ['./default.input.component.scss']
})

/**
 * Default form input component.
 */
export class FormDefaultInputComponent extends FormBaseInputComponent {
    @Input() type = 'text';
}
