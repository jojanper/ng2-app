import { createAction, props } from '@ngrx/store';

import { type } from '../../../../utils';
import { Beer } from '../models';


/**
 * Save beers data.
 */
export const saveAction = createAction(
    type('[beers] Save'),
    props<{
        beers: Array<Beer>,
        page: number
    }>()
);
