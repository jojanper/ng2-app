import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { FormModel } from './form.model';
import { FormValidatorBuilder, FormGroupValidatorBuilder } from './form.validators';
import { AppBaseTrackerComponent } from '../../utils/base';
import { FormOptions } from '../../models';


@Component({
  selector: 'dng-form',
  template: require('./form.component.html')
})

export class FormComponent extends AppBaseTrackerComponent implements OnInit, OnDestroy {
    form: FormGroup;
    @Input() model: FormModel;
    @Input() options: FormOptions;
    @Input() submitLabel: string;
    @Output() submitter: EventEmitter<any> = new EventEmitter<any>();

    protected inputDefs: Array<any>;

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    ngOnInit () {
        let groupValidators = [];

        // Build input for form group creation
        const formGroup = {};
        const modelInputs = this.model.getInputs();
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

        // Track state changes
        this.initStateChangesTracker();
    }

    ngOnDestroy () {
        this.untrackStateChanges();
    }

    submitForm () {
        // Set to processing state, the caller must eventually set the state to completed
        this.setProcessingState();

        this.submitter.emit(this.form.value);

        if (this.options && this.options.resetOnSubmit === true) {
            this.form.reset();
        }
    }

    /**
     * Build form input definition. Consists of input's initial value and associated validators.
     */
    private buildInput(model: FormModel, input: string): any {

        // For checkbox input, each item must be attached with own form controller
        if (model.isCheckbox(input)) {
            const formDef: FormArray = new FormArray([]);

            model.getInputDataChoices(input).forEach(item => {
                const formGrp = new FormGroup({});
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

    protected get showSubmit() {
        let status = true;
        if (this.options) {
            status = (this.options.noSubmitLabel !== true);
        }

        return status;
    }
}
