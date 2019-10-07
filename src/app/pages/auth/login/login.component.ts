import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { FormModel } from '../../../widgets';
import { goAction } from '../../../router';
import { ApiService, RouterService } from '../../../services';
import { getUserAuthenticationStatus } from '../../../rx/rx.reducers';
import { authenticateAction } from '../../../rx/auth';
import { AutoUnsubscribe } from '../../../utils';

import { LoginConfig } from './login.config';


@Component({
    selector: 'dng-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
@AutoUnsubscribe(['unsubscribe'])
export class LoginComponent implements OnInit, OnDestroy {
    returnUrl: string;
    registerView: string;
    passwordResetView: string;

    model: FormModel;
    private unsubscribe: Subject<void> = new Subject();

    constructor(
        private store: Store<any>, private route: ActivatedRoute, private api: ApiService,
        private routerService: RouterService
    ) {
        this.registerView = this.routerService.resolveByName('auth.register-view');
        this.passwordResetView = this.routerService.resolveByName('auth.pw-reset-request-view');
    }

    ngOnInit() {
        // Redirect URL, if any
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.routerService.resolveByName('home-view');

        // Form definition in terms of a model
        this.model = new FormModel();
        this.model.addInputs(LoginConfig.formConfig);

        // Redirect to home page once user is authenticated
        this.store.pipe(
            select(getUserAuthenticationStatus),
            takeUntil(this.unsubscribe),
            filter(authenticated => authenticated)
        ).subscribe(() => this.store.dispatch(goAction({ path: [this.returnUrl] })));
    }

    ngOnDestroy() { }

    login(data: any) {
        // Send login data to server and once successfully done, set user to authenticated status locally
        this.api.sendBackend('login', data).subscribe((response) => {
            this.store.dispatch(authenticateAction({ payload: response }));
        });
    }
}
