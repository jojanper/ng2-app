import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers';
import { ActivateConfig } from './activate.config';
import { AlertService, ApiService } from '../../../services';
import { RouteManager, GoAction } from '../../../router';


@Component({
    selector: 'dng-activate',
    template: '<dng-spinner><p class="text-center">Activating account, please wait...</p></dng-spinner>'
})
export class ActivateComponent {

    constructor(private store: Store<State>, private alertService: AlertService,
        private api: ApiService, private route: ActivatedRoute) {

        // Extract the activation key from current route and send to backend
        const activationkey = this.route.snapshot.params.activationkey;
        this.activate({activationkey});
    }

    private dispatch(view: string): void {
        const action = new GoAction({path: [RouteManager.resolveByName(view)]});
        this.store.dispatch(action);
    }

    private activate(data: any) {
        this.api.sendBackend('account-activation', data).subscribe(
        // On success go to login view
        () => {
            this.dispatch('login-view');

            // Show message to user
            this.alertService.success(ActivateConfig.onSuccessMsg);
        },
        // On error go to home view
        () => {
            this.dispatch('home-view');
        });
    }
}
