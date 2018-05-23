import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { GoAction } from '../../../router';
import { ActivateComponent } from './activate.component';
import { DraalFormsModule, DraalWidgetsCoreModule } from '../../../widgets';
import { NetworkService, AlertService, ApiService } from '../../../services';
import { TestHelper, TestHttpHelper, TestServiceHelper,
    ResponseFixtures } from '../../../../test_helpers';


const rootApi = ApiService.rootUrl;
const activateUrl = ResponseFixtures.root.data[1].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[activateUrl] = JSON.stringify({});


describe('Activate Component', () => {
    let fixture: ComponentFixture<ActivateComponent>;
    let mockBackend: HttpTestingController;

    const activationKey = 'abcdef';
    const expectedUrl = activateUrl.replace(':activationkey', activationKey);

    const mockStore = new TestServiceHelper.store();
    const mockAlert = new TestServiceHelper.alertService();
    const mockRoute = {
        snapshot: {
            params: {
                activationkey: activationKey
            }
        }
    };

    beforeEach(done => {
        mockStore.reset();
        mockAlert.reset();

        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalFormsModule,
                DraalWidgetsCoreModule
            ].concat(TestHttpHelper.http),
            declarations: [ActivateComponent],
            providers: [
                NetworkService,
                ApiService,
                {provide: Store, useValue: mockStore},
                {provide: AlertService, useValue: mockAlert},
                {provide: ActivatedRoute, useValue: mockRoute}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ActivateComponent);
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();
            mockBackend.expectOne(rootApi).flush(responses[rootApi]);

            fixture.detectChanges();

            done();
        });
    });

    it('account activation succeeds', async(() => {
        // GIVEN account activation view is opened
        // WHEN successful call to backend is made to activate account
        mockBackend.expectOne(expectedUrl).flush(responses[activateUrl]);
        mockBackend.verify();

        // THEN user is directed to login page on success
        // AND notification message is shown to user
        TestHelper.verifyStoreAndAlert(mockStore, mockAlert, '/auth/login', 'success');
    }));

    it('account activation fails', async(() => {
        // GIVEN account activation view is opened
        // WHEN unsuccessful call to backend is made to activate account
        const response = JSON.stringify({errors: ['Error']});
        mockBackend.expectOne(expectedUrl).error(new ErrorEvent(response), {status: 404});
        mockBackend.verify();

        // THEN user is directed to home page on error
        // AND error message is shown to user
        TestHelper.verifyStoreAndAlert(mockStore, mockAlert, '/', 'error');
    }));
});
