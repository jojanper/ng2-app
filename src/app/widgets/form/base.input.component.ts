import { Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


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

    protected onInit() {}

    ngOnInit () {
        this.control = <FormControl>this.parentForm.controls[this.options.ref];
        this.onInit();
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
