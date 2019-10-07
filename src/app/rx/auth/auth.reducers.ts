import { createReducer, on, Action } from '@ngrx/store';

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

const authReducer = createReducer(
    initialState,
    on(auth.loginSuccessAction, (state, { payload }) => ({
        ...state,
        authenticated: true,
        user: payload
    })),
    on(auth.logoutSuccessAction, () => initialState)
);

export function reducer(state: State | undefined, action: Action) {
    return authReducer(state, action);
}

export const getAuthStatus = (state: State) => state.authenticated;
