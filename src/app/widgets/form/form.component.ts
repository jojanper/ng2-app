import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { FormModel } from './form.model';
import { FormValidatorBuilder } from './form.validators';


@Component({
  selector: 'dng-form',
  template: require('./form.component.html')
})

export class FormComponent implements OnInit {
    form: FormGroup;
    @Input() model: FormModel;
    @Input() submitLabel: string;
    @Output() submit: EventEmitter<any> = new EventEmitter<any>();

    private inputDefs: Array<any>;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit () {

        // Build input for form group creation
        let formGroup = {};
        let modelInputs = this.model.getInputs();
        for (let i = 0; i < modelInputs.length; i++) {
            const input = modelInputs[i];
            formGroup[input] = this.buildInput(this.model, input);
        }

        // Form input definitions
        this.inputDefs = this.model.getOptions();

        // Create the actual form group
        this.form = this.formBuilder.group(formGroup);
    }

    submitForm () {
        this.submit.emit(this.form.value);
    }

    /**
     * Build form input definition. Consists if input's initial value and associated validators.
     */
    private buildInput(model: FormModel, input: string): any {
        return [model.getInputData(input), FormValidatorBuilder.validatorObjects(model.getInputValidators(input))];
    }
}
