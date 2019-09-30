import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';

import * as RouterActions from './routes.actions';


@Injectable()
export class RouterEffects {
    // Handle navigation actions
    navigate$ = createEffect(() =>
        this.actions$.pipe(
            ofType(RouterActions.goAction),
            tap(({ path, query: queryParams, extras }) =>
                this.router.navigate(path, { queryParams, ...extras })
            )
        ),
        { dispatch: false, resubscribeOnError: false }
    );

    constructor(private actions$: Actions, private router: Router) { }
}
