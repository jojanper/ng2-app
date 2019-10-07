import { createReducer, on, Action } from '@ngrx/store';

import * as actions from './actions';
import { Beer } from '../models';


export interface State {
    page: number;
    beers: Array<Beer>;
}

export const initialState: State = {
    page: 1,
    beers: []
};

const beersReducer = createReducer(
    initialState,
    on(actions.saveAction, (state, { beers, page }) => ({
        page: page,
        beers: [...state.beers, ...beers]
    }))
);

export function reducer(state: State | undefined, action: Action) {
    return beersReducer(state, action);
}

export const getBeers = (state: State) => state;
