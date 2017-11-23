import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { RouterEffects } from './routes.effects';
import * as RouterActions from './routes.actions';
import { TestServiceHelper } from '../../test_helpers';


describe('RouterEffects', () => {

    let routerEffects: RouterEffects;
    let actions = new ReplaySubject(1);
    let metadata: EffectsMetadata<RouterEffects>;

    const mockRouter = new TestServiceHelper.router();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                RouterEffects,
                {provide: Router, useValue: mockRouter},
                provideMockActions(() => actions)
            ]
        });

        routerEffects = TestBed.get(RouterEffects);
        metadata = getEffectsMetadata(routerEffects);
    });

    it('should register navigate$ that does not dispatch an action', () => {
        expect(metadata.navigate$).toEqual({ dispatch: false });
    });

    it('should respond to GoAction', () => {
        const action = new RouterActions.GoAction({path: ['/foo']});
        actions.next(action);

        routerEffects.navigate$.subscribe(() => {
            expect(mockRouter.getNavigateUrl()).toEqual('/foo');
        });
    });
});
