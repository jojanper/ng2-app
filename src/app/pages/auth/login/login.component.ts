import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { takeUntil, filter } from 'rxjs/operators';

import { State } from '../../../application/app.reducers'

import { FormModel } from '../../../widgets';
import { LoginConfig } from './login.config';
import { RouteManager, GoAction } from '../../../router';
import { ApiService /*, BackendResponse*/ } from '../../../services';
import { getUserAuthenticationStatus } from '../../../rx/rx.reducers';
import { AuthenticateAction } from '../../../rx/auth';


@Component({
    selector: 'dng-login',
    template: require('./login.component.html')
})

export class LoginComponent implements OnInit, OnDestroy {
    returnUrl: string;

    private model: FormModel;

    private unsubscribe: Subject<void> = new Subject();

    constructor(private store: Store<State>, private route: ActivatedRoute, private api: ApiService) {}

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || RouteManager.resolveByName('home-view');

        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(LoginConfig.formConfig);

        const observable: Observable<boolean> = this.store.select(getUserAuthenticationStatus);
        observable.pipe(
            takeUntil(this.unsubscribe),
            filter(authenticated => authenticated)
        ).subscribe(authenticated => {
            console.log('AUTHENTICATED');
            console.log(authenticated);
            this.dispatch(this.returnUrl);
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
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
            this.store.dispatch(new AuthenticateAction(response));
            // this.dispatch(this.returnUrl);
        });
    }
}
