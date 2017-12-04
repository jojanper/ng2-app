import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';


import { GoAction } from '../../../router';
import { LoginComponent } from './login.component';
import { DraalServicesModule, NetworkService, ApiService } from '../../../services';
import { DraalFormsModule } from '../../../widgets';
import { TestHttpHelper, TestFormHelper, TestServiceHelper,
    TestObservablesHelper, ResponseFixtures } from '../../../../test_helpers';
import * as AuthActions from '../../../rx/auth';


const sendInput = TestFormHelper.sendInput;
const submitDisabled = TestFormHelper.submitDisabled;

const rootApi = ApiService.rootUrl;
const loginUrl = ResponseFixtures.root.data[2].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[loginUrl] = JSON.stringify({});


describe('Login Component', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let mockBackend: HttpTestingController;

    let mockActivatedRoute = {
        snapshot: {
            queryParams: {}
        }
    };

    const authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
    const mockStore = new TestServiceHelper.store([authStatus.observer]);

    beforeEach(done => {
        mockStore.reset();
        authStatus.setStatus(false);

        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalFormsModule,
                DraalServicesModule.forRoot()
            ].concat(TestHttpHelper.http),
            declarations: [LoginComponent],
            providers: [
                NetworkService,
                ApiService,
                {provide: Store, useValue: mockStore},
                {provide: ActivatedRoute, useValue: mockActivatedRoute}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(LoginComponent);
            fixture.detectChanges();
            mockBackend = TestHttpHelper.getMockBackend();
            done();
        });
    });

    it('should show login form', done => {
        // GIVEN login page
        // WHEN rendering login component
        fixture.whenStable().then(() => {

            // THEN login form should be present
            expect(fixture.nativeElement.querySelectorAll('form').length).toEqual(1);

            // AND form contains 2 inputs
            expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(2);

            // AND form contains one submit button
            expect(fixture.nativeElement.querySelectorAll('form button').length).toEqual(1);
            done();
        });
    });

    it('username is filled to login form', async(() => {
        fixture.whenStable().then(() => {
            sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'user').then(() => {
                fixture.detectChanges();
                expect(submitDisabled(fixture)).toBeTruthy();
            });
        });
    }));

    const hasDangerClass = (element: any): boolean => {
        return (element.getAttribute('class').indexOf('form-control-danger') > -1) ? true : false;
    }

    it('invalid username is typed', async(() => {
        fixture.whenStable().then(() => {
            const element = fixture.nativeElement.querySelectorAll('input')[0];
            sendInput(fixture, element, 'u').then(() => {
                fixture.detectChanges();
                expect(hasDangerClass(element)).toBeTruthy();
            });
        });
    }));

    it('invalid password is typed', async(() => {
        fixture.whenStable().then(() => {
            const element = fixture.nativeElement.querySelectorAll('input')[1];
            sendInput(fixture, element, 'pa').then(() => {
                fixture.detectChanges();
                expect(hasDangerClass(element)).toBeTruthy();
            });
        });
    }));

    it('password is filled to login form', async(() => {
        fixture.whenStable().then(() => {
            sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456').then(() => {
                fixture.detectChanges();
                expect(submitDisabled(fixture)).toBeTruthy();
            });
        });
    }));

    it('sign-in button is clicked', async(() => {
        // GIVEN login form has all the needed details
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[0], 'test');
        sendInput(fixture, fixture.nativeElement.querySelectorAll('input')[1], '123456');
        fixture.detectChanges();

        fixture.whenStable().then(() => {

            expect(submitDisabled(fixture)).toBeFalsy();

            // WHEN user click sign-in button
            let button = fixture.nativeElement.querySelector('form button');
            button.click();

            mockBackend.expectOne(rootApi).flush(responses[rootApi]);
            mockBackend.expectOne(loginUrl).flush(responses[loginUrl]);
            mockBackend.verify();

            fixture.detectChanges();
            fixture.whenStable().then(() => {
                // AND user is directed to home page
                let action = <GoAction>mockStore.getDispatchAction(0);
                expect(action.type).toEqual(AuthActions.ActionTypes.AUTHENTICATE);

                // AND no other actions are called
                action = <GoAction>mockStore.getDispatchAction(1);
                expect(action).toBeUndefined();

                // -----

                // WHEN user status changes to authenticated
                authStatus.setStatus(true);

                // THEN user is directed to home page
                action = <GoAction>mockStore.getDispatchAction(1);
                expect(action.payload.path).toEqual(['/home']);
            });
        });
    }));
});
