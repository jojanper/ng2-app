import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'dng2-form-input',
  template: require('./input.component.html')
})

export class FormInputComponent implements OnInit {

    @Input() name: string;
    @Input() type = 'text';
    @Input() label: string;
    @Input() parentForm: FormGroup;

    private control: FormControl;

    ngOnInit () {
        this.control = <FormControl>this.parentForm.controls[this.name];
    }

    /**
     * Form group validation (Bootstrap) class(es).
     */
    getGroupClass() {
        const classes = [];

        if (!this.control.valid) {
            classes.push('has-danger');
        } else {
            classes.push('has-success');
        }

        return classes.join(' ');
    }

    /**
     * Form input validation (Bootstrap) class(es).
     */
    getInputClass() {
        const classes = [];

        if (!this.control.valid) {
            classes.push('form-control-danger');
        } else {
            classes.push('form-control-success');
        }

        return classes.join(' ');
    }
}
