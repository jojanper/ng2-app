import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { CookieService } from 'ngx-cookie';

import * as AuthActions from './auth.actions';
import { AppCookie } from '../../utils';


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
    loadCookie$ = this.actions$
        .ofType<AuthActions.UserCookieLoadAction>(AuthActions.ActionTypes.LOAD_AUTH_COOKIE)
        .map(() => {
            // Retrieve user cookie
            const user = this.cookie.getCookieObject(USER_COOKIE);

            // No user cookie found -> switch to logout state
            if (!user) {
                return new AuthActions.LogoutSuccessAction();
            }

            // User cookie found -> switch to login state
            return new AuthActions.LoginSuccessAction(user);
        });

    // User has successfully authenticated in the remote server
    @Effect()
    authenticate$ = this.actions$
        .ofType<AuthActions.AuthenticateAction>(AuthActions.ActionTypes.AUTHENTICATE)
        .map(action => action.payload)
        .exhaustMap((response) => {
            // Extend user data with local expiration time
            const user = Object.assign({
                validAt: new Date(Date.now() + response.data.expires)
            }, response.data);

            // Save user auth details as cookie for persistent access
            this.cookie.setCookie(USER_COOKIE, user, {
                expires: user.validAt
            });

            return of(new AuthActions.LoginSuccessAction(user));
        });

    // On logout, remove user authentication cookie
    @Effect({dispatch: false})
    logoutSuccess$ = this.actions$
        .ofType<AuthActions.LogoutSuccessAction>(AuthActions.ActionTypes.LOGOUT_SUCCESS)
        .do(() => {
            this.cookie.clear(USER_COOKIE);
            return of(true);
        });

    constructor(private actions$: Actions, cookieService: CookieService) {
        this.cookie = new AppCookie(cookieService);
    }
}
