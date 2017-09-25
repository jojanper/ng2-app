import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormModel } from '../../form';
import { NetworkService, AlertService } from '../../../services';


const registerMsg = `Check your email! An activation link has been sent to the email address you supplied,
along with instructions for activating your account.`;

@Component({
    selector: 'dng-register',
    template: require('./register.component.html')
})

export class RegisterComponent {

    private model: FormModel;

    constructor(private network: NetworkService, private router: Router, private alertService: AlertService) {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInput('email', '', {
            type: 'text',
            label: 'Email',
            placeholder: 'Enter your email',
            validators: [{name: 'required'}]
        });
        this.model.addInput('password', '', {
            type: 'password',
            label: 'Password',
            placeholder: 'Enter password',
            validators: [{name: 'required'}]
        });
        this.model.addInput('password2', '', {
            type: 'password',
            label: 'Confirm Password',
            placeholder: 'Confirm password',
            validators: [{name: 'required'}],
            groupvalidators: [{name: 'compare', fields: ['password', 'password2']}]
        });
    }

    register(data: any) {
        this.network.post('/api/auth/signup', data).subscribe(() => {
            this.router.navigate(['/auth/login']);
            this.alertService.success(registerMsg);
        });
    }
}
