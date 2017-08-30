import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormModel } from '../../form';
import { NetworkService } from '../../../services';


@Component({
    selector: 'dng-register',
    template: require('./register.component.html')
})

export class RegisterComponent {

    private model: FormModel;

    constructor(private network: NetworkService, private router: Router) {
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
    }

    register(data: any) {
        this.network.post('/api/auth/signup', data).subscribe((item) => {
            this.router.navigate(['/auth/login']);
        });
    }
}
