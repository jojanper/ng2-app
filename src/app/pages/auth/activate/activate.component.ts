import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers';
import { ActivateConfig } from './activate.config';
import { AlertService, ApiService } from '../../../services';
import { RouteManager, GoAction } from '../../../router';


@Component({
    selector: 'dng-activate',
    template: '<dng-spinner></dng-spinner>'
})
export class ActivateComponent {

    constructor(private store: Store<State>, private alertService: AlertService,
        private api: ApiService, private route: ActivatedRoute) {

        // Extract the activation key and send to backend
        const activationkey = this.route.snapshot.params.activationkey;
        this.activate({activationkey});
    }

    activate(data: any) {
        this.api.sendBackend('account-activation', data).subscribe(() => {
            // Go to login view
            const action = new GoAction({path: [RouteManager.resolveByName('login-view')]});
            this.store.dispatch(action);

            // Show message to user
            this.alertService.success(ActivateConfig.onSuccessMsg);
        },
        // On error go to home view
        () => {
            const action = new GoAction({path: [RouteManager.resolveByName('home-view')]});
            this.store.dispatch(action);
        });
    }
}
