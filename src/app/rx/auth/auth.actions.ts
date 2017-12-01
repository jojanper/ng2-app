import { Action } from '@ngrx/store';

import { type } from '../../utils';
// import { BackendResponse } from '../../services';
import { User } from './models';


/**
 * Authentication related action types.
 */
export const ActionTypes = {
    AUTHENTICATE: type('[auth] Authenticate'),
    LOGIN_SUCCESS: type('[auth] Login success'),
    LOGOUT_SUCCESS: type('[auth] Logout success')
};

/**
 * Authenticate user.
 */
export class AuthenticateAction implements Action {
    readonly type = ActionTypes.AUTHENTICATE;

    constructor(public payload: any) {}
}

/**
 * Login has succeeded.
 */
export class LoginSuccessAction implements Action {
    readonly type = ActionTypes.LOGIN_SUCCESS;

    constructor(public payload: User) {}
}

/**
 * Logout has succeeded.
 */
export class LogoutSuccessAction implements Action {
    readonly type = ActionTypes.LOGOUT_SUCCESS;
}

export type Actions =
    | AuthenticateAction
    | LoginSuccessAction
    | LogoutSuccessAction;
