import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { FormModel } from './form.model';


@Component({
  selector: 'dng2-form',
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
        let modelInputs = this.model.getInputNames();
        for (let i = 0; i < modelInputs.length; i++) {
            const input = modelInputs[i];
            formGroup[input] = this.buildInput(this.model, input);
        }

        // Form input definitions
        this.inputDefs = this.model.getInputs();

        // Create the actual form group
        this.form = this.formBuilder.group(formGroup);
    }

    submitForm () {
        this.submit.emit(this.form.value);
    }

    private buildInput(model: FormModel, input: string): any {
        let validators = [];
        const data = model.getValidators(input);

        data.forEach((validator: any) => {
            switch (validator.name) {
                case 'required':
                    validators.push(Validators.required);
                    break;

                case 'minlength':
                    validators.push(Validators.minLength(validator.value));
                    break;

                case 'maxlength':
                    validators.push(Validators.maxLength(validator.value));
                    break;
            }
        });

        return ['', validators];
    }
}
