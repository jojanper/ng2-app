import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormInputErrorHandler } from './form.inputmessages.component';


@Component({
  selector: 'dng-form-input',
  template: require('./form.input.component.html')
})

export class FormInputComponent implements OnInit {

    @Input() type: string;
    @Input() label: string;
    @Input() options: any;
    @Input() parentForm: FormGroup;

    private control: FormControl;
    private errorHandler: FormInputErrorHandler;

    ngOnInit () {
        this.control = <FormControl>this.parentForm.controls[this.options.ref];
        this.errorHandler = new FormInputErrorHandler(this.control, this.options);
    }

    /**
     * Form group validation (Bootstrap) class(es).
     */
    getGroupClass() {
        const classes = [];

        if (!this.errorHandler.isValid()) {
            classes.push('has-danger');
        } else {
            classes.push('has-success');
        }

        return classes.join(' ');
    }
}
