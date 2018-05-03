import { ComponentConfig } from '../../../models';

const resetMsg = `A password reset link has been sent to the email address you supplied.`;

export const PwResetRequestConfig = {
    onSuccessMsg: resetMsg,
    formConfig: [
        {
            email: {
                type: 'text',
                label: 'Username',
                placeholder: 'Enter username',
                validators: [{name: 'required'}]
            }
        }
    ]
} as ComponentConfig;
