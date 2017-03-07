import { FormControl } from '@angular/forms';

export class FormValidatorFactory {

    static password(control: FormControl) {
        // (?=.*[0-9])       - Assert a string has at least one number
        if (control.value.match(/^.*[0-9]$/)) {
            return null;
        } else {
            return {'password': true};
        }
    }
}
