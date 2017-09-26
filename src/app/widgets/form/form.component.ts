import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { FormModel } from './form.model';
import { FormValidatorBuilder, FormGroupValidatorBuilder } from './form.validators';


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
        let groupValidators = [];

        // Build input for form group creation
        let formGroup = {};
        let modelInputs = this.model.getInputs();
        for (let i = 0; i < modelInputs.length; i++) {
            const input = modelInputs[i];

            // Build form input
            formGroup[input] = this.buildInput(this.model, input);

            // Build group validator for the input, if any
            groupValidators = groupValidators.concat(this.buildGroupValidator(this.model, input));
        }

        // Form input definitions
        this.inputDefs = this.model.getOptions();

        // Create the actual form group with group validators, if any
        // Please note that angular5 most likely is going to support group
        // validators in such way that only array of validators can be given instead
        // of using Validators.compose as a workaround.
        // See https://github.com/angular/angular/issues/12763
        this.form = this.formBuilder.group(formGroup, {validator: Validators.compose(groupValidators)});
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

    private buildGroupValidator(model: FormModel, input: string): Array<any> {
        return FormGroupValidatorBuilder.validatorObjects(model.getInputGroupValidators(input));
    }
}
