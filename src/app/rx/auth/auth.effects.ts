import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { CookieService } from 'ngx-cookie';
import { flatMap, map, exhaustMap, catchError } from 'rxjs/operators';

import * as AuthActions from './auth.actions';
import { AppCookie } from '../../utils';
import { goAction } from '../../router';
import { AppEventsService, ApiService, AppEventTypes, RouterService } from '../../services';


// Name of cookie where user authentication details are stored
const USER_COOKIE = 'user-auth-cookie';


/**
 * Authentication effects. Store keeps tracks of current user state. For persistent
 * authentication access, the user authentication object is stored as cookie. On login,
 * user object is saved to cookie and the cookie is removed on logout. On app start up,
 * existence of user cookie is checked and if cookie is valid, user state is switched
 * to login state, otherwise user state remains in unauthenticated state.
 */
@Injectable()
export class AuthEffects {
    private cookie: AppCookie;

    // On app start up, load user authentication cookie if present
    @Effect()
    loadCookie$ = this.actions$.pipe(
        ofType<AuthActions.UserCookieLoadAction>(AuthActions.ActionTypes.LOAD_AUTH_COOKIE),
        map(() => {
            // Retrieve user cookie
            const user = this.cookie.getCookieObject(USER_COOKIE);

            // No user cookie found -> switch to logout state
            if (!user) {
                return new AuthActions.LogoutSuccessAction('home-view');
            }

            // User cookie found -> switch to login state
            return new AuthActions.LoginSuccessAction(user);
        })
    );

    // User has successfully authenticated in the remote server
    @Effect()
    authenticate$ = this.actions$.pipe(
        ofType<AuthActions.AuthenticateAction>(AuthActions.ActionTypes.AUTHENTICATE),
        map(action => action.payload),
        exhaustMap((response) => {
            // Extend user data with local expiration time
            const user = Object.assign({
                validAt: new Date(Date.now() + response.data.expires)
            }, response.data);

            // Save user auth details as cookie for persistent access
            this.cookie.setCookie(USER_COOKIE, user, {
                expires: user.validAt
            });

            // Remote login succeeded -> switch to login state
            return of(new AuthActions.LoginSuccessAction(user));
        })
    );

    // Logout user
    @Effect()
    logout$ = this.actions$.pipe(
        ofType<AuthActions.LogoutAction>(AuthActions.ActionTypes.LOGOUT),
        flatMap(() => {
            // Call logout on remote server
            return this.api.sendBackend('logout', {}).pipe(
                // On success, switch to logout state
                map(() => new AuthActions.LogoutSuccessAction('auth.login-view')),

                // On error, go to home page
                catchError(() => of(goAction({ path: [this.routerService.resolveByName('home-view')] })))
            );
        })
    );

    // On logout success
    @Effect()
    logoutSuccess$ = this.actions$.pipe(
        ofType<AuthActions.LogoutSuccessAction>(AuthActions.ActionTypes.LOGOUT_SUCCESS),
        map((action) => {
            // Clear user authentication status
            this.cookie.clear(USER_COOKIE);

            // Other parts of the application may be interested in logout activity
            // -> send logout event
            this.appEvents.sendEvent(AppEventTypes.LOGOUT);

            // Redirect to login page on redirect, otherwise go to root view
            const url = this.routerService.resolveByName(action.redirectView);
            return goAction({ path: [url] });
        })
    );

    constructor(
        private api: ApiService, private actions$: Actions, cookieService: CookieService,
        private appEvents: AppEventsService, private routerService: RouterService
    ) {
        this.cookie = new AppCookie(cookieService);
    }
}
