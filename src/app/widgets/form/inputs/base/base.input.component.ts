import { Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { FormInputErrorHandler } from '../../form.inputmessages.component';


/**
 * Base class for form inputs. All form inputs must be derived from this class.
 */
export class FormBaseInputComponent implements OnInit {

    // Input type
    @Input() type: string;

    // Input options, if any
    @Input() options: any;

    // Form reference
    @Input() parentForm: FormGroup;

    // Input controller
    protected control: FormControl;
    private errorHandler: FormInputErrorHandler;

    protected onInit() {}

    ngOnInit () {
        this.control = <FormControl>this.parentForm.controls[this.options.ref];
        this.errorHandler = new FormInputErrorHandler(this.control, this.options);
        this.onInit();
    }

    /**
     * Form input validation (Bootstrap) class(es).
     */
    getInputClass() {
        const classes = [];

        if (!this.errorHandler.isValid()) {
            classes.push('is-invalid');
        } else {
            classes.push('is-valid');
        }

        return classes.join(' ');
    }
}
