import { ComponentConfig } from '../../../models';

export const LoginConfig = {
    formConfig: [
        {
            username: {
                type: 'text',
                label: 'Username',
                placeholder: 'Enter username (4 characters at minimum)',
                validators: [{name: 'required'}, {name: 'minlength', value: 4}]
            }
        },
        {
            password: {
                type: 'password',
                label: 'Password',
                placeholder: 'Enter password (length between 4-10 characters)',
                validators: [
                    {name: 'required'},
                    {name: 'password'},
                    {name: 'minlength', value: 4},
                    {name: 'maxlength', value: 10}
                ]
            }
        }
    ]
} as ComponentConfig;
