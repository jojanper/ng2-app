import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormModel } from '../../../widgets';
import { RegisterConfig } from './register.config';
import { AlertService, ApiService } from '../../../services';
import { RouteManager } from '../../../models';


const registerMsg = `Check your email! An activation link has been sent to the email address you supplied,
along with instructions for activating your account.`;

@Component({
    selector: 'dng-register',
    template: require('./register.component.html')
})
export class RegisterComponent {

    private model: FormModel;

    constructor(private router: Router, private alertService: AlertService, private api: ApiService) {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(RegisterConfig);
    }

    register(data: any) {
        this.api.register(data).subscribe(() => {
            this.router.navigate([RouteManager.resolveByName('login-view')]);
            this.alertService.success(registerMsg);
        });
    }
}
