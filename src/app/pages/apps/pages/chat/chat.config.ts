import { ComponentConfig } from '../../../../models';

export const ChatConfig = {
    formConfig: [
        {
            message: {
                type: 'text',
                label: '',
                noLabel: true,
                placeholder: 'Type message',
                validators: [{name: 'required'}],
                validationmessages: {
                    disabled: true
                }
            }
        }
    ]
} as ComponentConfig;
