/**
 * The module setup follows the steps as outlined in:
 * https://github.com/ngrx/platform/blob/master/example-app/app/reducers/index.ts
 */
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { Params } from '@angular/router';
import { RouterReducerState, routerReducer } from '@ngrx/router-store';


interface RouterStateUrl {
    url: string;
    queryParams: Params;
}

/**
 * We treat each reducer like a table in a database. This means our top level
 * state interface is just a map of keys to inner state types.
 */
export interface State {
    routerReducer: RouterReducerState<RouterStateUrl>;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<State> = {
    routerReducer: routerReducer,
};

// console.log all actions
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
    return function(state: State, action: any): State {
        console.log('state', state);
        console.log('action', action);

        return reducer(state, action);
    };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<State>[] = [logger];
