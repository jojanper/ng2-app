import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';

import * as AuthActions from './auth.actions';


@Injectable()
export class AuthEffects {

    @Effect()
    loginSuccess$ = this.actions$.ofType<AuthActions.LoginSuccessAction>(AuthActions.ActionTypes.LOGIN_SUCCESS)
        .do(() => of());

    constructor(private actions$: Actions) {}
}
