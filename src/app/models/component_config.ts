export interface FormConfigData {
    type: string;
    label: string;
    noLabel?: boolean;
    placeholder: string;
    validators: Array<any>;
    groupvalidators?: Array<any>;
    validationmessages?: any;
}

export interface FormConfig {
    [key: string]: FormConfigData;
}

export interface ComponentConfig {
    onSuccessMsg?: string;
    formConfig: Array<FormConfig>;
}
