import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers';
import { FormModel } from '../../../widgets';
import { ActivateConfig } from './activate.config';
import { AlertService, ApiService } from '../../../services';
import { RouteManager, GoAction } from '../../../router';


@Component({
    selector: 'dng-activate',
    template: require('./activate.component.html')
})
export class ActivateComponent {

    private model: FormModel;

    constructor(private store: Store<State>, private alertService: AlertService, private api: ApiService) {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(ActivateConfig.formConfig);
    }

    activate(data: any) {
        this.api.sendBackend('account-activation', data).subscribe(() => {
            // Go to login view
            const action = new GoAction({path: [RouteManager.resolveByName('login-view')]});
            this.store.dispatch(action);

            // Show message to user
            this.alertService.success(ActivateConfig.onSuccessMsg);
        });
    }
}
