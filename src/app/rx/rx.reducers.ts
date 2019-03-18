import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromAuth from './auth/auth.reducers';
import * as fromRoot from '../application/app.reducers';


export const FEATURE_NAME = 'apprx';

export interface RxState {
    user: fromAuth.State;
}

export interface State extends fromRoot.State {
    apprx: RxState;
}

// Feature state reducers
export const reducers = {
    user: fromAuth.reducer
};

// Observable to feature state
export const selectAppRxState = createFeatureSelector<State, RxState>(FEATURE_NAME);


// Observable to user's state
export const selectUserState = createSelector(
    selectAppRxState, (state: RxState) => state.user
);

// Observable to user's authentication status
export const getUserAuthenticationStatus = createSelector(selectUserState, fromAuth.getAuthStatus);
