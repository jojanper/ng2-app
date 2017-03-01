import { forwardRef, ViewChild, ElementRef, AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import * as $ from 'jquery';
import 'chosen-js';

const SELECT_INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormSelectComponent),
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
    template: require('./select.component.html'),
    providers: [SELECT_INPUT_VALUE_ACCESSOR, SELECT_INPUT_VALIDATOR]
})
export class FormSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    @ViewChild('selectElem') el: ElementRef;
    items = ['First', 'Second', 'Third'];

    @Input() name: string;
    @Input() parentForm: FormGroup;

    private selectedValue: string;
    private $element: any;
    private control: FormControl;
    private onTouched = () => { };
    private onChange: (_: any) => void = () => { };

    ngOnInit () {
        this.control = <FormControl>this.parentForm.controls[this.name];
    }

    ngAfterViewInit() {
        this.$element = $(this.el.nativeElement);

        this.$element.chosen().on('change', (_e, args) => {
            this.selectedValue = args.selected;
            this.onChange(this.selectedValue);
            this.onTouched();
        });
    }

    writeValue(obj: any) {
        this.selectedValue = obj;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    getInputClass() {
        const classes = [];

        if (!this.control.valid) {
            classes.push('form-control-danger');
        } else {
            classes.push('form-control-success');
        }

        if (this.$element) {
            let el = this.$element.parent().find('.chosen-container a');

            el.removeClass('chosen-single');
            el.addClass('form-control ' + classes.join(' '));
            this.$element.parent().show();
        }

        return '';
    }
}
