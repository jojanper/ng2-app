import { createAction, props } from '@ngrx/store';
import { NavigationExtras } from '@angular/router';

import { type } from '../utils';

/**
 * Go (=navigate) action implementation.
 */
export const goAction = createAction(
    type('[router] Go'),
    props<{
        path: any[];
        query?: object;
        extras?: NavigationExtras;
    }>()
);
