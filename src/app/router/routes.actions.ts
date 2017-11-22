import { Action } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

import { type } from '../utils';


/**
 * Router related action types.
 */
export const ActionTypes = {
    GO: type('[router] Go')
};

/**
 * Go (=navigate) action implementation.
 */
export class GoAction implements Action {
    readonly type = ActionTypes.GO;

    constructor(public payload: {
        path: any[];
        query?: object;
        extras?: NavigationExtras;
    }) {}
}

export type Actions = GoAction;
