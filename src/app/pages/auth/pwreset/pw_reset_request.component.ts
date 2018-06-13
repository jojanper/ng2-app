import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormModel } from '../../../widgets';
import { ApiService, AlertService, ConnectionOptions, RouterService } from '../../../services';

import { PwResetRequestConfig } from './pw_reset_request.config';
import { BaseAuthComponent } from '../activate';


@Component({
    selector: 'dng-pw-reset-request',
    templateUrl: './pw_reset_request.component.html'
})
export class PwResetRequestComponent extends BaseAuthComponent implements OnInit {
    model: FormModel;

    constructor(
        store: Store<any>, alertService: AlertService, private api: ApiService,
        routerService: RouterService
    ) {
        super(store, alertService, routerService);
    }

    ngOnInit() {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(PwResetRequestConfig.formConfig);
    }

    reset(data: any) {
        const options = new ConnectionOptions();
        options.disableErrors = true;

        /*
         * Send reset request to server and finalize the request from UI point of view, i.e.,
         * return to login view regardless of the response from server. This should succeed
         * regardless of whether user email was found in the server or not. Otherwise
         * it is too easy to probe the existing users registered to the system.
         */
        this.api.sendBackend('password-reset-request', data, options).subscribe(
            () => this.finalize(), // success
            () => this.finalize()  // error
        );
    }

    private finalize() {
        // Go to home view
        this.goAction('home-view');

        // Show message to user
        this.showMessage(PwResetRequestConfig.onSuccessMsg);
    }
}
