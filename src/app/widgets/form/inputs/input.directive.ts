// Based on https://github.com/toddmotto/angular-dynamic-forms
import { ComponentFactoryResolver, ComponentRef, Directive, Input, OnChanges, OnInit, Type, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { InputField } from './input.interface';
import { FormSelectInputWrapperComponent } from './select/select.input.component';
import { FormRadioInputComponent } from './radio/radio.input.component';
import { FormCheckboxInputComponent } from './checkbox/checkbox.input.component';
import { FormDefaultInputComponent } from './base/default.input.component';

const components: { [type: string]: Type<InputField> } = {
    select: FormSelectInputWrapperComponent,
    text: FormDefaultInputComponent,
    password: FormDefaultInputComponent,
    radio: FormRadioInputComponent,
    checkbox: FormCheckboxInputComponent
};

@Directive({
    selector: '[dngDynamicInput]'
})
export class DynamicInputDirective implements InputField, OnChanges, OnInit {
    // Input type
    @Input() type: string;

    // Input options, if any
    @Input() options: any;

    // Form reference
    @Input() parentForm: FormGroup;

    component: ComponentRef<InputField>;

    constructor(
        private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef
    ) { }

    ngOnChanges() {
        if (this.component) {
            this.setFields();
        }
    }

    ngOnInit() {
        if (!components[this.type]) {
            const supportedTypes = Object.keys(components).join(', ');
            throw new Error(
                `Unsupported input type (${this.type}). Supported types: ${supportedTypes}`
            );
        }
        const component = this.resolver.resolveComponentFactory<InputField>(components[this.type]);
        this.component = this.container.createComponent(component);
        this.setFields();
    }

    private setFields() {
        if (this.component) {
            this.component.instance.type = this.type;
            this.component.instance.options = this.options;
            this.component.instance.parentForm = this.parentForm;
        }
    }
}
