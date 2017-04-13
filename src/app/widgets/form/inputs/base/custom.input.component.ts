import { ControlValueAccessor } from '@angular/forms';

import { FormBaseInputComponent } from './base.input.component';


/**
 * Base class for custom form inputs. ControlValueAccessor need to be implemented in order to
 * make form controls working.
 */
export class FormBaseCustomInputComponent extends FormBaseInputComponent implements ControlValueAccessor {
    private _inputValue: any;
    protected onTouched = () => { };
    protected onChange: (_: any) => void = () => { };

    writeValue(obj: any) {
        this._inputValue = obj;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    get inputValue(): any {
        return this._inputValue;
    }

    setInputValue(value: any) {
        this._inputValue = value;
        this.onChange(this._inputValue);
        this.onTouched();
    }
}
