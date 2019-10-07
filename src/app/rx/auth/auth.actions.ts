import { createAction, props } from '@ngrx/store';

import { type } from '../../utils';
import { BackendResponse } from '../../services';
import { User } from './models';


/**
 * Authenticate user.
 */
export const authenticateAction = createAction(
    type('[auth] Authenticate'),
    props<{
        payload: BackendResponse
    }>()
);

/**
 * Login has succeeded.
 */
export const loginSuccessAction = createAction(
    type('[auth] Login success'),
    props<{
        payload: User
    }>()
);

/**
 * Logout user.
 */
export const logoutAction = createAction(
    type('[auth] Logout')
);

/**
 * Logout has succeeded.
 */
export const logoutSuccessAction = createAction(
    type('[auth] Logout success'),
    props<{
        redirectView: string
    }>()
);

/**
 * User authentication cookie is saved.
 */
export const userCookieLoadAction = createAction(
    type('[auth] Load cookie')
);
