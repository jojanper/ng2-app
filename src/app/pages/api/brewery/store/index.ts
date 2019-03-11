import { createSelector, createFeatureSelector } from '@ngrx/store';

import * as fromBeers from './beers.reducers';
import * as fromRoot from '../../../../application/app.reducers';


export const FEATURE_NAME = 'brewery';

export interface BreweryState {
    beers: fromBeers.State;
}

export interface State extends fromRoot.State {
    brewery: BreweryState;
}

// Feature state reducers
export const reducers = {
    beers: fromBeers.reducer
};

// Observable to feature state
export const selectBreweryState = createFeatureSelector<State, BreweryState>(FEATURE_NAME);

// Observable to beers state
export const selectBeersState = createSelector(
    selectBreweryState, (state: BreweryState) => state.beers
);

// Observable to beers data
export const getBeers = createSelector(selectBeersState, fromBeers.getBeers);
