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
import { ApiService } from '../../../services';
import { getUserAuthenticationStatus } from '../../../rx/rx.reducers';
import { AuthenticateAction } from '../../../rx/auth';


export function AutoUnsubscribe(subjects = []) {
    return function (constructor) {
        const original = constructor.prototype.ngOnDestroy;

        constructor.prototype.ngOnDestroy = function () {
            subjects.forEach((subject) => {
                this[subject].next();
                this[subject].complete();
            });

            if (original && typeof original === 'function') {
                original.apply(this, arguments);
            }
        };
    }
}


@Component({
    selector: 'dng-login',
    template: require('./login.component.html')
})
@AutoUnsubscribe(['unsubscribe'])
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

        // Redirect to home page once user is authenticated
        const observable: Observable<boolean> = this.store.select(getUserAuthenticationStatus);
        observable.pipe(
            takeUntil(this.unsubscribe),
            filter(authenticated => authenticated)
        ).subscribe(() => this.dispatch(this.returnUrl));
    }

    ngOnDestroy() {}

    private dispatch(url: string): void {
        const action = new GoAction({path: [url]});
        this.store.dispatch(action);
    }

    login(data: any) {
        this.api.sendBackend('login', data).subscribe((response) => {
            this.store.dispatch(new AuthenticateAction(response));
        });
    }
}
