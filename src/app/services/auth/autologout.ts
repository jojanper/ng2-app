import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { filter, switchMap } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';

import { LogoutAction } from '../../rx/auth';
import { selectUserState } from '../../rx/rx.reducers';
import { State } from '../../application/app.reducers';
import { AlertService } from '../alert';


@Injectable()
export class AutoLogout implements OnDestroy {
    loginSubscription: Subscription;
    logoutSubscription: Subscription;

    constructor(private store: Store<State>, protected alertService: AlertService) {
        this.loginSubscription = null;
        this.loginMonitor();
        this.logoutMonitor();
    }

    /**
     * Start session expiration timer every time user state changes to authenticated state.
     */
    private loginMonitor() {
        // Unsubscribe previous subscription, this may be needed if user state changes
        // to unauthenticated state before sesson timer has expired.
        if (this.loginSubscription) {
            this.loginSubscription.unsubscribe();
        }

        this.loginSubscription = this.store.select(selectUserState)
            .pipe(
                // When user state changes to authenticated, start the session timer
                filter(state => state.authenticated),
                switchMap(state => timer(state.user.validAt - Date.now()))
            )
            .subscribe(() => {
                // Let the user know that session has expired
                this.alertService.info('Your session has expired, logging out...');

                // Wait some time since logout clears all alert messages
                setTimeout(() => this.store.dispatch(new LogoutAction()), 3000);
            });
    }

    private logoutMonitor() {
        // Every time user state changes to unauthenticated state,
        // restart user authentication status monitoring
        this.logoutSubscription = this.store.select(selectUserState)
            .pipe(filter(user => !user.authenticated))
            .subscribe(() => this.loginMonitor());
    }

    ngOnDestroy() {
        this.loginSubscription.unsubscribe();
        this.logoutSubscription.unsubscribe();
    }
}
