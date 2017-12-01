import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State } from '../../../application/app.reducers'

import { FormModel } from '../../../widgets';
import { LoginConfig } from './login.config';
import { RouteManager, GoAction } from '../../../router';
import { ApiService, BackendResponse } from '../../../services';
import { getUserAuthenticationStatus } from '../../../rx/rx.reducers';
import * as AuthActions from '../../../rx/auth';


@Component({
    selector: 'dng-login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit {
    returnUrl: string;

    private model: FormModel;

    constructor(private store: Store<State>, private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || RouteManager.resolveByName('home-view');

        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(LoginConfig.formConfig);

        const observable: Observable<boolean> = this.store.select(getUserAuthenticationStatus);
        observable.filter(authenticated => authenticated).subscribe(authenticated => {
            console.log('AUTHENTICATED');
            console.log(authenticated);
        });
    }

    private dispatch(url: string): void {
        const action = new GoAction({path: [url]});
        this.store.dispatch(action);
    }

    login(data: any) {
        // Disable submit button with spinner
        // Call login action on remote server
        // On success
        //  -> Dispath AuthenticateAction, input as user data from server
        //    -> Create User model and return LoginSuccessAction
        //       -> AuthEffects.loginSuccess effect is not needed
        //       -> Convert APIResponse to User model
        // Create APIResponse interface
        // In login component, subscribe to authentication status and redirect to
        // desired view when authenticated

        // https://netbasal.com/listening-for-actions-in-ngrx-store-a699206d2210

        // Spinner action/observable?

        // Unsubscribe on destroy?

        this.api.sendBackend('login', data).subscribe((response) => {
            this.store.dispatch(new AuthActions.AuthenticateAction({payload: <BackendResponse>response}));
            this.dispatch(this.returnUrl);
        });
    }
}
