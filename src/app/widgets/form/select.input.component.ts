import { forwardRef, ViewChild, ElementRef, AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import * as $ from 'jquery';
import 'chosen-js';

import { FormBaseCustomInputComponent } from './custom.input.component';


const SELECT_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormSelectInputComponent),
  multi: true
};

// Returns null when valid else the validation object
function validate(_c: FormControl) {
    return null;
}

const SELECT_INPUT_VALIDATOR = {
  provide: NG_VALIDATORS,
  useValue: validate,
  multi: true
};

@Component({
    selector: 'dng2-select-input',
    template: require('./select.input.component.html'),
    providers: [SELECT_INPUT_VALUE_ACCESSOR, SELECT_INPUT_VALIDATOR],
    styleUrls: ['./select.input.component.scss']
})
export class FormSelectInputComponent extends FormBaseCustomInputComponent implements AfterViewInit, OnDestroy {
    @ViewChild('selectElem') el: ElementRef;
    items = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eight', 'Nineth'];

    private $element: any;

    ngAfterViewInit() {
        const self = this;

        this.$element = $(this.el.nativeElement);

        this.$element.chosen({
            width: '100%',
            disable_search_threshold: 10,
            placeholder_text_single: this.options.placeholder || '',
            placeholder_text_multiple: this.options.placeholder || '',
        }).change(function() {
            const values = $(this).val();

            if (!self.multiple) {
                self.setInputValue(values);
            } else {
                const selectedValues = values.map(item => {
                    return self.items[parseInt(item.split(':')[0], 10) - 1];
                });

                self.setInputValue(selectedValues);
            }
        });
    }

    ngOnDestroy() {
        this.$element.chosen('destroy');
    }

    getInputClass() {
        const classes = super.getInputClass().split(' ');

        if (this.$element) {
            let el;

            if (!this.multiple) {
                el = this.$element.parent().find('.chosen-container a');
                el.removeClass('chosen-single');
            } else {
                el = this.$element.parent().find('.chosen-container .chosen-choices');
            }

            el.addClass('form-control ' + classes.join(' '));
            this.$element.parent().show();
        }

        return '';
    }

    get selectedValue(): any {
        return this.inputValue;
    }

    private get multiple(): boolean {
        return this.options.multiple;
    }
}
