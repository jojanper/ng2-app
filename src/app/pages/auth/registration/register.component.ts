import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormModel } from '../../../widgets';
import { RegisterConfig } from './register.config';
import { AlertService, ApiService } from '../../../services';
import { RouteManager, GoAction } from '../../../router';


@Component({
    selector: 'dng-register',
    template: require('./register.component.html')
})
export class RegisterComponent {

    private model: FormModel;

    constructor(private store: Store<any>, private alertService: AlertService, private api: ApiService) {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(RegisterConfig.formConfig);
    }

    register(data: any) {
        this.api.sendBackend('signup', data).subscribe(() => {
            // Go to home view
            const action = new GoAction({path: [RouteManager.resolveByName('home-view')]});
            this.store.dispatch(action);

            // Show message to user
            this.alertService.success(RegisterConfig.onSuccessMsg, {timeout: 5000});
        });
    }
}
