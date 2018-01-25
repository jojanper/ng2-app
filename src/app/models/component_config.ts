/**
 * Settings for form validation messages.
 */
export interface ValidationMessages {
    // If true, show validation messages as soon as input is changed
    ondirty?: boolean | undefined;

    // If true, do not show any validation messages for the input
    disabled?: boolean | undefined;
}

/**
 * Form input definition.
 */
export interface FormInputConfigData {
    // Type of input
    type: string;

    // Label for the input
    label: string;

    // Placeholder value
    placeholder: string;

    // List of validators that are executed
    validators: Array<any>;

    // Input ref, this typically gets automatically assigned from FormConfig ref
    ref?: string,

    // If true, no label is shown for the input
    noLabel?: boolean | undefined;

    // List of form group level validators the are executed
    groupvalidators?: Array<any>;

    // Validation messages settings
    validationmessages?: ValidationMessages;
}

/**
 * Form definition consists of input ref and associated ref definition.
 */
export interface FormConfig {
    [ref: string]: FormInputConfigData;
}

/**
 * Component config,
 */
export interface ComponentConfig {
    // Any messages related to success message
    onSuccessMsg?: string;

    // Form definition for the component
    formConfig: Array<FormConfig>;
}

/**
 * Options for controlling form appearance and behaviour.
 */
export interface FormOptions {
    // If true, don't show separate submit button
    noSubmitLabel?: boolean | undefined;

    // If true, form is reset after submit has been called
    resetOnSubmit?: boolean | undefined;
}
