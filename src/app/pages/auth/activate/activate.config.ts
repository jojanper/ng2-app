import { ComponentConfig } from '../../../models';


const successMsg = `Your account has been activated. You can now login.`;

export const ActivateConfig = {
    onSuccessMsg: successMsg,
    formConfig: [
        {
            activationkey: {
                type: 'text',
                label: 'Activation key',
                placeholder: 'Enter your activation key',
                validators: [{name: 'required'}]
            }
        }
    ]
} as ComponentConfig;
