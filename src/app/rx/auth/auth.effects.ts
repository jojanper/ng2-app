import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import * as AuthActions from './auth.actions';
import { User } from './models';


@Injectable()
export class AuthEffects {

    @Effect()
    authenticate$ = this.actions$.ofType<AuthActions.AuthenticateAction>(AuthActions.ActionTypes.AUTHENTICATE)
        .map(action => action.payload)
        .exhaustMap(() => {
            const user = {name: 'test'} as User;
            return of(new AuthActions.LoginSuccessAction(user));
        });

    // User has successfully authenticated in the remote server and locally
    @Effect({dispatch: false})
    loginSuccess$ = this.actions$.ofType<AuthActions.LoginSuccessAction>(AuthActions.ActionTypes.LOGIN_SUCCESS)
        .do(() => of(true));

    constructor(private actions$: Actions) {}
}
