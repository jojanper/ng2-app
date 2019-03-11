import { Action } from '@ngrx/store';

import { type } from '../../../../utils';
import { Beer } from '../models';


export const ActionTypes = {
    LOAD: type('[beers] Load'),
    SAVE: type('[beers] Save')
};

/**
 * Save beers data.
 */
export class SaveAction implements Action {
    readonly type = ActionTypes.SAVE;

    constructor(public payload: {
        beers: Array<Beer>
        page: number
    }) {}
}

/**
 * Load beers data.
 */
export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;
}

export type Actions =
    | SaveAction
    | LoadAction;
