import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { ActivateConfig } from './activate.config';
import { AlertService, ApiService, RouterService } from '../../../services';
import { GoAction } from '../../../router';


export abstract class BaseAuthComponent {
    constructor(private store: Store<any>, private alertService: AlertService,
        private routerService: RouterService) {}

    protected goAction(view: string): void {
        const action = new GoAction({path: [this.routerService.resolveByName(view)]});
        this.store.dispatch(action);
    }

    protected showMessage(msg: string, timeout = 5000) {
        this.alertService.success(msg, {timeout});
    }
}


@Component({
    selector: 'dng-activate',
    template: '<dng-spinner><p class="text-center">Activating account, please wait...</p></dng-spinner>'
})
export class ActivateComponent extends BaseAuthComponent {

    constructor(
        store: Store<any>, alertService: AlertService, private api: ApiService,
        private route: ActivatedRoute, routerService: RouterService
    ) {
        super(store, alertService, routerService);

        // Extract the activation key from current route and send to backend
        const activationkey = this.route.snapshot.params.activationkey;
        this.activate({activationkey});
    }

    private activate(data: any) {
        this.api.sendBackend('account-activation', data).subscribe(
        // On success go to login view
        () => {
            this.goAction('auth.login-view');

            // Show message to user
            this.showMessage(ActivateConfig.onSuccessMsg);
        },
        // On error go to home view
        () => this.goAction('home-view'));
    }
}
