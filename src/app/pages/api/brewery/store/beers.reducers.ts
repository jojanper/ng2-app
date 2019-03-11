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

export function reducer(state = initialState, action: actions.Actions): State {
    switch (action.type) {
        // Add new data
        case actions.ActionTypes.SAVE: {
            const payload = action['payload'];
            return {
                page: payload['page'],
                beers: [...state.beers, ...payload['beers']]
            };
        }

        default: {
            return state;
        }
    }
}

export const getBeers = (state: State) => state;
