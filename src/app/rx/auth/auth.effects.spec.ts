import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { Login, User } from './models';


describe('AuthEffects', () => {

    let authEffects: AuthEffects;
    let actions = new ReplaySubject(1);
    let metadata: EffectsMetadata<AuthEffects>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AuthEffects,
                provideMockActions(() => actions)
            ]
        });

        authEffects = TestBed.get(AuthEffects);
        metadata = getEffectsMetadata(authEffects);
    });

    it('should register authenticate$ that dispatches an action', () => {
        expect(metadata.authenticate$).toEqual({ dispatch: true });
    });

    it('should respond to AuthenticateAction', () => {
        const login = {username: 'test', password: 'password'} as Login;
        const action = new AuthActions.AuthenticateAction(login);
        actions.next(action);

        authEffects.authenticate$.subscribe((response) => {
            // Action returns another action that store should then dispatch
            expect(response instanceof AuthActions.LoginSuccessAction)
                .toBe(true, 'instance of LoginSuccessAction');
        });
    });

    it('should register loginSuccess$ that does not dispatch an action', () => {
        expect(metadata.loginSuccess$).toEqual({ dispatch: false });
    });

    it('should respond to LoginSuccessAction', () => {
        const user = {name: 'test'} as User;
        const action = new AuthActions.LoginSuccessAction(user);
        actions.next(action);

        authEffects.loginSuccess$.subscribe((status) => {
            expect(status).toBeTruthy();
        });
    });
});