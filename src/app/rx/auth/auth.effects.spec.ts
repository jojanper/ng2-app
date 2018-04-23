import { TestBed, async } from '@angular/core/testing';
import { EffectsMetadata, getEffectsMetadata } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { CookieService } from 'ngx-cookie';
import { HttpTestingController } from '@angular/common/http/testing';

import { GoAction } from '../../router';
import { AuthEffects } from './auth.effects';
import * as AuthActions from './auth.actions';
import { User } from './models';
import { BackendResponse, AppEventsService, ApiService,
    NetworkService, AlertService } from '../../services';
import { TestServiceHelper, TestHttpHelper, ResponseFixtures } from '../../../test_helpers';


const rootApi = ApiService.rootUrl;
const logoutUrl = ResponseFixtures.root.data[3].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[logoutUrl] = JSON.stringify({});

const user = {
    email: 'test@test.com',
    expires: 123456,
    validAt: Date.now()
} as User;


describe('AuthEffects', () => {
    let authEffects: AuthEffects;
    const actions = new ReplaySubject(1);
    let metadata: EffectsMetadata<AuthEffects>;

    let mockBackend: HttpTestingController;

    const mockCookie = new TestServiceHelper.CookieService();
    const cookieService = mockCookie.getService();

    let eventSend = false;
    const mockEvents = {
        sendEvent: () => {
            eventSend = true;
        }
    };

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: TestHttpHelper.http,
            providers: [
                AuthEffects,
                NetworkService,
                ApiService,
                AlertService,
                provideMockActions(() => actions),
                {provide: CookieService, useValue: cookieService},
                {provide: AppEventsService, useValue: mockEvents}
            ]
        }).compileComponents().then(() => {
            cookieService.removeAll();

            authEffects = TestBed.get(AuthEffects);
            metadata = getEffectsMetadata(authEffects);

            mockBackend = TestHttpHelper.getMockBackend();

            done();
        });
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
            expect(response instanceof AuthActions.LogoutSuccessAction)
                .toBe(true, 'instance of LogoutSuccessAction');

            // Instructs redirect to home view
            expect(response['redirectView']).toEqual('home-view');
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

    it('should register logoutSuccess$ that dispatches an action', () => {
        expect(metadata.logoutSuccess$).toEqual({ dispatch: true });
    });

    it('user cookie is removed on LogoutSuccessAction', () => {
        cookieService.putObject('user-auth-cookie', user);

        const action = new AuthActions.LogoutSuccessAction('login-view');
        actions.next(action);

        authEffects.logoutSuccess$.subscribe((response) => {
            // No user cookie present
            const cookie = cookieService.getObject('user-auth-cookie');
            expect(cookie).toBeUndefined();

            // Action returns another action that redirects to specified view
            expect(response instanceof GoAction).toBe(true, 'instance of GoAction');
            expect(response.payload.path).toEqual(['/auth/login']);

            // Logout event has been sent
            expect(eventSend).toBeTruthy();
        });
    });

    it('LogoutAction: user logout succeeds', async(() => {
        const action = new AuthActions.LogoutAction();
        actions.next(action);

        authEffects.logout$.subscribe((response) => {
            // Action returns another action
            expect(response instanceof AuthActions.LogoutSuccessAction)
                .toBe(true, 'instance of LogoutSuccessAction');
        });

        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        mockBackend.expectOne(logoutUrl).flush(responses[logoutUrl]);
        mockBackend.verify();
    }));

    it('LogoutAction: user logout fails', async(() => {
        const action = new AuthActions.LogoutAction();
        actions.next(action);

        authEffects.logout$.subscribe((response) => {
            // Action returns another action that redirects to specified view
            expect(response instanceof GoAction).toBe(true, 'instance of GoAction');
            expect(response['payload'].path).toEqual(['/']);
        });

        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        const data = JSON.stringify({errors: ['Error']});
        mockBackend.expectOne(logoutUrl).error(new ErrorEvent(data), {status: 404});
        mockBackend.verify();
    }));
});
