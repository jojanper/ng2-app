import { FormGroup } from '@angular/forms';

export interface InputField {
    // Input type
    type: string;

    // Input options, if any
    options: any;

    // Form reference
    parentForm: FormGroup;
}
