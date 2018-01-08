import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';

import { GoAction } from '../../../router';
import { LogoutComponent } from './logout.component';
import { LogoutSuccessAction } from '../../../rx/auth';
import { DraalWidgetsCoreModule } from '../../../widgets';
import { AppEventsService, ApiService, NetworkService, AlertService } from '../../../services';
import { TestServiceHelper, TestHttpHelper, ResponseFixtures } from '../../../../test_helpers';


const rootApi = ApiService.rootUrl;
const logoutUrl = ResponseFixtures.root.data[3].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[logoutUrl] = JSON.stringify({});


describe('Logout Component', () => {
    let fixture: ComponentFixture<LogoutComponent>;
    let mockBackend: HttpTestingController;

    const mockStore = new TestServiceHelper.store();

    let eventSend = false;
    let mockEvents = {
        sendEvent: () => {
            eventSend = true;
        }
    };

    beforeEach(done => {
        mockStore.reset();

        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalWidgetsCoreModule
            ].concat(TestHttpHelper.http),
            declarations: [LogoutComponent],
            providers: [
                NetworkService,
                ApiService,
                AlertService,
                {provide: Store, useValue: mockStore},
                {provide: AppEventsService, useValue: mockEvents}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(LogoutComponent);
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();
            mockBackend.expectOne(rootApi).flush(responses[rootApi]);

            done();
        });
    });

    it('sign-out is performed', async(() => {
        // WHEN user calls sign-out component
        fixture.whenStable().then(() => {
            let action;

            mockBackend.expectOne(logoutUrl).flush(responses[logoutUrl]);
            mockBackend.verify();

            // THEN logout action is triggered
            action = <LogoutSuccessAction>mockStore.getDispatchAction(0);
            expect(action.type).toEqual(new LogoutSuccessAction().type);

            // AND user is directed to login page
            action = <GoAction>mockStore.getDispatchAction(1);
            expect(action.payload.path).toEqual(['/auth/login']);

            // AND logout event has been sent
            expect(eventSend).toBeTruthy();
        });
    }));

    it('sign-out fails', async(() => {
        // WHEN user calls sign-out component
        fixture.whenStable().then(() => {
            const response = JSON.stringify({errors: ['Error']});
            mockBackend.expectOne(logoutUrl).error(new ErrorEvent(response), {status: 404});
            mockBackend.verify();

            // THEN user is redirected to home view
            const action = <GoAction>mockStore.getDispatchAction(0);
            expect(action.payload.path).toEqual(['/']);
        });
    }));
});
