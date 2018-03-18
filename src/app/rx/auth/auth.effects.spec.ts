import { TestBed } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CookieService } from 'ngx-cookie';

import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { User } from './models';
import { BackendResponse } from '../../services';
import { TestServiceHelper } from '../../../test_helpers';


const user = {
    email: 'test@test.com',
    expires: 123456,
    validAt: Date.now()
} as User;

describe('AuthEffects', () => {

    let authEffects: AuthEffects;
    let actions = new ReplaySubject(1);
    let metadata: EffectsMetadata<AuthEffects>;

    const mockCookie = new TestServiceHelper.CookieService();
    const cookieService = mockCookie.getService();

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AuthEffects,
                provideMockActions(() => actions),
                {provide: CookieService, useValue: cookieService}
            ]
        });

        cookieService.removeAll();

        authEffects = TestBed.get(AuthEffects);
        metadata = getEffectsMetadata(authEffects);
    });

    afterEach(() => {
        actions.complete();
    });

    it('should register authenticate$ that dispatches an action', () => {
        expect(metadata.authenticate$).toEqual({ dispatch: true });
    });

    it('should respond to AuthenticateAction', () => {
        const loginResponse = {data: user} as BackendResponse;
        const action = new AuthActions.AuthenticateAction(loginResponse);
        actions.next(action);

        authEffects.authenticate$.subscribe((response) => {
            // Action returns another action
            expect(response instanceof AuthActions.LoginSuccessAction)
                .toBe(true, 'instance of LoginSuccessAction');

            // And user authentication cookie is available
            const cookie = cookieService.getObject('user-auth-cookie');
            expect(cookie['email']).toEqual(user.email);
        });
    });

    it('user cookie is not found by UserCookieLoadAction', () => {
        const action = new AuthActions.UserCookieLoadAction();
        actions.next(action);

        authEffects.loadCookie$.subscribe((response) => {
            // Action returns another action
            expect(response instanceof AuthActions.LogoutSuccessAction)
                .toBe(true, 'instance of LogoutSuccessAction');
        });
    });

    it('user cookie is found by UserCookieLoadAction', () => {
        cookieService.putObject('user-auth-cookie', user);

        const action = new AuthActions.UserCookieLoadAction();
        actions.next(action);

        authEffects.loadCookie$.subscribe((response) => {
            // Action returns another action
            expect(response instanceof AuthActions.LoginSuccessAction)
                .toBe(true, 'instance of LoginSuccessAction');
        });
    });

    it('should register logoutSuccess$ that does not dispatch', () => {
        expect(metadata.logoutSuccess$).toEqual({ dispatch: false });
    });

    it('user cookie is removed on LogoutSuccessAction', () => {
        cookieService.putObject('user-auth-cookie', user);

        const action = new AuthActions.LogoutSuccessAction();
        actions.next(action);

        authEffects.logoutSuccess$.subscribe(() => {
            const cookie = cookieService.getObject('user-auth-cookie');
            expect(cookie).toBeUndefined();
        });
    });
});
