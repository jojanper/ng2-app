import { Component, OnInit } from '@angular/core';
// import { Store } from '@ngrx/store';

import { FormModel } from '../../../widgets';
// import { RouteManager, GoAction } from '../../../router';
// import { ApiService } from '../../../services';

import { PwResetRequestConfig } from './pw_reset_request.config';


@Component({
    selector: 'dng-pw-reset-request',
    template: require('./pw_reset_request.component.html')
})
export class PwResetRequestComponent implements OnInit {
    private model: FormModel;

    constructor(/*private store: Store<any>, private api: ApiService*/) {}

    ngOnInit() {
        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(PwResetRequestConfig.formConfig);
    }

    reset(data: any) {
        /*
        // Send login data to server and once successfully done, set user to authenticated status locally
        this.api.sendBackend('login', data).subscribe((response) => {
            this.store.dispatch(new AuthenticateAction(response));
        });
        */
        console.log(data);
    }
}
