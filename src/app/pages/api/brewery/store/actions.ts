import { Action } from '@ngrx/store';

import { type } from '../../../../utils';
import { Beer } from '../models';


export const ActionTypes = {
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

export type Actions =
    | SaveAction;
