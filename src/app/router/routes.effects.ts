import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';

import * as RouterActions from './routes.actions';


@Injectable()
export class RouterEffects {

    // Handle navigation actions
    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType<RouterActions.GoAction>(RouterActions.ActionTypes.GO),
        map(action => action.payload),
        tap(({path, query: queryParams, extras}) =>
            this.router.navigate(path, {queryParams, ...extras})
        )
    );

    constructor(private actions$: Actions, private router: Router) {}
}
