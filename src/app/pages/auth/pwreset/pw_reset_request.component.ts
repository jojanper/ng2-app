import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { FormModel } from '../../../widgets';
import { GoAction, RouteManager } from '../../../router';
import { ApiService, AlertService, ConnectionOptions } from '../../../services';

import { PwResetRequestConfig } from './pw_reset_request.config';


@Component({
    selector: 'dng-pw-reset-request',
    template: require('./pw_reset_request.component.html')
})
export class PwResetRequestComponent implements OnInit {
    private model: FormModel;

    constructor(private store: Store<any>, private alertService: AlertService, private api: ApiService) {}

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
            () => this.finalize(), () => this.finalize()
        );
    }

    private finalize() {
        // Go to home view
        const action = new GoAction({path: [RouteManager.resolveByName('home-view')]});
        this.store.dispatch(action);

        // Show message to user
        this.alertService.success(PwResetRequestConfig.onSuccessMsg, {timeout: 5000});
    }
}
