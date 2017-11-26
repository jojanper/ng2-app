import { ComponentConfig } from '../../../models';


const registerMsg = `Check your email! An activation link has been sent to the email address you supplied,
    along with instructions for activating your account.`;

export const RegisterConfig = {
    onSuccessMsg: registerMsg,
    formConfig: [
        {
            email: {
                type: 'text',
                label: 'Email',
                placeholder: 'Enter your email',
                validators: [{name: 'required'}]
            }
        },
        {
            password: {
                type: 'password',
                label: 'Password',
                placeholder: 'Enter password',
                validators: [{name: 'required'}]
            }
        },
        {
            password2: {
                type: 'password',
                label: 'Confirm Password',
                placeholder: 'Confirm password',
                validators: [{name: 'required'}],
                groupvalidators: [{
                    name: 'compare',
                    fields: ['password', 'password2'],
                    message: 'Passwords do not match'
                }],
                validationmessages: {
                    ondirty: true
                }
            }
        }
    ]
} as ComponentConfig;
