import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormModel } from '../../../widgets';
import { RegisterConfig } from './register.config';
import { AlertService, ApiService, RouterService } from '../../../services';
import { BaseAuthComponent } from '../activate';

@Component({
    selector: 'dng-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent extends BaseAuthComponent {
    model: FormModel;

    constructor(
        store: Store<any>, alertService: AlertService, private api: ApiService,
        routerService: RouterService
    ) {
        super(store, alertService, routerService);

        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(RegisterConfig.formConfig);
    }

    register(data: any) {
        this.api.sendBackend('signup', data).subscribe(() => {
            // Go to home view
            this.goAction('home-view');

            // Show message to user
            this.showMessage(RegisterConfig.onSuccessMsg);
        });
    }
}
