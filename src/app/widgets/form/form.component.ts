import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

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
     * Build form input definition. Consists of input's initial value and associated validators.
     */
    private buildInput(model: FormModel, input: string): any {

        // For checkbox input, each item must be attached with own form controller
        if (model.isCheckbox(input)) {
            let formDef: FormArray = new FormArray([]);

            model.getInputDataChoices(input).forEach(item => {
                let formGrp = new FormGroup({});
                formGrp.addControl(item.name, new FormControl(item.value));
                formDef.push(formGrp);
            });

            return formDef;
        }

        return [model.getInputData(input), FormValidatorBuilder.validatorObjects(model.getInputValidators(input))];
    }

    /*
    private buildGroupValidator(input: string): any {

    }
    */
}
