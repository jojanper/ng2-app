import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';

import { RouteManager, GoAction } from '../../router';
import { State } from '../../application/app.reducers';
import { getUserAuthenticationStatus } from '../../rx/rx.reducers';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class AuthGuard implements CanActivate {

    private redirectUrl: string;

    constructor(private store: Store<State>) {
        this.redirectUrl = RouteManager.resolveByName('login-view');
    }

    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const observable = this.store.select(getUserAuthenticationStatus);
        observable.subscribe(authenticated => {
            if (!authenticated) {
                // User is not logged in so redirect to login page with the return url
                this.store.dispatch(new GoAction({
                    path: [this.redirectUrl],
                    query: {returnUrl: (state) ? state.url : ''}
                }));
            }
        });

        return observable;
    }
}
