import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromAuth from './auth/auth.reducers';
import * as fromRoot from '../application/app.reducers';


export const FEATURE_NAME = 'rx';

export interface RxState {
    user: fromAuth.State
}

export interface State extends fromRoot.State {
    rx: RxState
}

export const reducers = {
    user: fromAuth.reducer
};

export const selectRxState = createFeatureSelector<RxState>(FEATURE_NAME);
export const selectUserState = createSelector(
    selectRxState, (state: RxState) => state.user
);
export const getUserAuthenticated = createSelector(selectUserState, fromAuth.getAuthStatus);
