import { createReducer, on } from '@ngrx/store';

import * as auth from './auth.actions';
import { User } from './models';


export interface State {
    authenticated: boolean;
    user: User | null;
}

// Initially, user is unknown and obviously unauthenticated
export const initialState: State = {
    authenticated: false,
    user: null,
};

export const reducer = createReducer(
    initialState,
    on(auth.loginSuccessAction, (state, { payload }) => ({
        ...state,
        authenticated: true,
        user: payload
    })),
    on(auth.logoutSuccessAction, () => initialState)
);

export const getAuthStatus = (state: State) => state.authenticated;
