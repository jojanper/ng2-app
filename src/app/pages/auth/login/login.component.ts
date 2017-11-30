import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { CookieService, CookieOptionsArgs } from 'angular2-cookie/core';
import { Store } from '@ngrx/store';

import { State } from '../../../application/app.reducers'

import { FormModel } from '../../../widgets';
// import { Config } from '../../../services';
import { LoginConfig } from './login.config';
import { RouteManager, GoAction } from '../../../router';
import { ApiService } from '../../../services';


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
    }

    private dispatch(url: string): void {
        const action = new GoAction({path: [url]});
        this.store.dispatch(action);
    }

    login(data: any) {
        /*
        const user = {username: data.username};
        const config: Config = new Config();

        // Store user details in globals cookie that keeps user logged in for 1 one day (or until they logout)
        let cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 1);
        const options: CookieOptionsArgs = {expires: cookieExp};
        this.cookieService.putObject(config.authObject(), user, options);
        this.router.navigate([this.returnUrl]);
        */

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

        this.api.sendBackend('login', data).subscribe((/*response*/) => {
            this.dispatch(this.returnUrl);
        });
    }
}
