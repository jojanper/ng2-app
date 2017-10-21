import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormModel } from '../../form';
import { RegisterConfig } from './register.config';
import { NetworkService, AlertService, UrlResolver } from '../../../services';


const registerMsg = `Check your email! An activation link has been sent to the email address you supplied,
along with instructions for activating your account.`;

@Component({
    selector: 'dng-register',
    template: require('./register.component.html')
})
export class RegisterComponent {

    private model: FormModel;

    constructor(private network: NetworkService, private router: Router,
        private alertService: AlertService, private resolver: UrlResolver) {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(RegisterConfig);
    }

    register(data: any) {
        this.resolver.resolve('signup').subscribe((url) => {
            this.network.post(url, data).subscribe(() => {
                this.router.navigate(['/auth/login']);
                this.alertService.success(registerMsg);
            });
        });
    }
}
