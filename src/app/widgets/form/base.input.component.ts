import { Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


/**
 * Base class for form inputs. All form inputs must be derived from this class.
 */
export class FormBaseInputComponent implements OnInit {

    // Input name, that is, the name of control this input refers to
    @Input() name: string;

    // Input type
    @Input() type: string;

    // Input options, if any
    @Input() options: any = {};

    // Form reference
    @Input() parentForm: FormGroup;

    // Input controller
    protected control: FormControl;

    ngOnInit () {
        this.control = <FormControl>this.parentForm.controls[this.name];
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
