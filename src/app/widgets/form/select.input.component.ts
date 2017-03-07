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
    /*
        return (this.selectedValue) ? null : {
            selectError: {
                valid: false,
            }
        };
        */
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
    items = ['First', 'Second', 'Third'];

    private $element: any;

    ngAfterViewInit() {
        this.$element = $(this.el.nativeElement);

        this.$element.chosen({
            width: '100%',
            disable_search_threshold: 10,
            placeholder_text_single: this.options.placeholder || ''
        }).on('change', (_e, args) => {
            this.setInputValue(args.selected);
        });
    }

    ngOnDestroy() {
        this.$element.chosen('destroy');
    }

    getInputClass() {
        const classes = super.getInputClass().split(' ');

        if (this.$element) {
            let el = this.$element.parent().find('.chosen-container a');

            el.removeClass('chosen-single');
            el.addClass('form-control ' + classes.join(' '));
            this.$element.parent().show();
        }

        return '';
    }

    get selectedValue(): any {
        return this.inputValue;
    }
}
