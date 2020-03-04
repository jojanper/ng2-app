import { forwardRef, ViewChild, ElementRef, AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import 'jquery';
import 'chosen-js';
declare const $: any;

import { FormBaseInputComponent } from '../base/base.input.component';
import { FormBaseCustomInputComponent } from '../base/custom.input.component';


const SELECT_INPUT_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    /* tslint:disable:no-use-before-declare */
    useExisting: forwardRef(() => FormSelectInputComponent),
    /* tslint:enable:no-use-before-declare */
    multi: true
};

// Returns null when valid else the validation object
export function validate(_c: FormControl) {
    return null;
}

export const SELECT_INPUT_VALIDATOR = {
    provide: NG_VALIDATORS,
    useValue: validate,
    multi: true
};

@Component({
    selector: 'dng-select',
    templateUrl: './select.input.component.html',
    providers: [SELECT_INPUT_VALUE_ACCESSOR, SELECT_INPUT_VALIDATOR],
    styleUrls: ['./select.input.component.scss']
})
export class FormSelectInputComponent extends FormBaseCustomInputComponent implements AfterViewInit, OnDestroy {
    @ViewChild('selectElem', { static: false }) el: ElementRef;

    private $element: any;
    private previousClasses: Array<string> = [];

    /**
     * Called when component is initialized. Make sure initial select values
     * are correctly loaded.
     */
    onInit() {
        this.setInputValue(this.control.value);
    }

    ngAfterViewInit() {
        const self = this;

        this.$element = $(this.el.nativeElement);

        // Enable chosen plugin for the select HTML
        this.$element.chosen({
            width: '100%',
            disable_search_threshold: 10,
            placeholder_text_single: this.options.placeholder || '',
            placeholder_text_multiple: this.options.placeholder || '',

            // Update selection value(s) to form controller
        }).on('change', function () {
            const values = $(this).val();

            if (!self.multiple) {
                self.setInputValue(self.options.selector.list[parseInt(values as string, 10)]);
            } else {
                const valuesList = values as Array<any>;
                const selectedValues = valuesList.map(item => {
                    return self.options.selector.list[parseInt(item.split(':')[0], 10) - 1];
                });

                self.setInputValue(selectedValues);
            }

            // Make sure form input validation is executed after dropdown is closed
        }).on('chosen:hiding_dropdown', function () {
            self.onTouched();
        });

        // Dynamically set the initial selection values
        setTimeout(() => {
            const data = this.getSelectedData();
            this.$element.val(data);
            this.$element.trigger('chosen:updated');
        });
    }

    ngOnDestroy() {
        this.$element.chosen('destroy');
    }

    /**
     * As chosen plugin alters the HTML, add correct validation classes
     * dynamically to the plugin HTML.
     */
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

            this.previousClasses.forEach(cls => el.removeClass(cls));
            el.addClass('form-control ' + classes.join(' '));
            this.$element.parent().show();

            this.previousClasses = classes;
        }

        return '';
    }

    /**
     * Retrieve rendering value for specified list item.
     *
     * @param item Selection list item
     */
    getViewValue(item: any): string {
        return (this.options.selector.displayRef) ? item[this.options.selector.displayRef] : item;
    }

    /**
     * Return true if multiple selection is allowed.
     */
    get multiple(): boolean {
        return this.options.multiple === true;
    }

    /**
     * Return selection list.
     */
    private get selectionList(): Array<any> {
        return this.options.selector.list;
    }

    /**
     * Return values that correspond to currently selected item(s). The data values
     * are searched from selection list and returned in format that can be directly
     * stored to the plugin. As items are stored as indices in the HTML (value attribute
     * is list index for options tag, see the template for more details), same format
     * must be used when assigning selected item(s).
     */
    private getSelectedData(): any {
        const data: Array<any> = [];
        const refData: Array<any> = (this.multiple) ? this.inputValue : [this.inputValue];

        const refList = this.selectionList;
        const refId = this.options.selector.idRef;
        refData.forEach(item => {
            const refItem = (refId) ? item[refId] : item;
            for (let i = 0; i < refList.length; i++) {
                const refListItem = (refId) ? refList[i][refId] : refList[i];
                if (refItem === refListItem) {
                    /* tslint:disable:quotemark */
                    data.push((this.multiple) ? (i + 1).toString() + ": '" + i.toString() + "'" : i);
                    /* tslint:enable:quotemark */
                    break;
                }
            }
        });

        return (this.multiple) ? data : data[0];
    }
}

@Component({
    selector: 'dng-select-input',
    template: `<div [formGroup]="parentForm"><dng-select type="{{ type }}" [options]="options" [parentForm]="parentForm" formControlName="{{ options.ref }}"></dng-select></div>`
})
export class FormSelectInputWrapperComponent extends FormBaseInputComponent {
}
