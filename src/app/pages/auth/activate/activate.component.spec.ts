import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';

import { GoAction } from '@src/router';
import { ActivateComponent } from './activate.component';
import { DraalFormsModule, DraalSpinnerModule } from '@src/widgets';
import { NetworkService, AlertService, ApiService } from '@src/services';
import { TestHttpHelper, TestServiceHelper, ResponseFixtures } from '@test/test_helpers';


const rootApi = ApiService.rootUrl;
const activateUrl = ResponseFixtures.root.data[1].url;

const responses = {};
responses[rootApi] = ResponseFixtures.root;
responses[activateUrl] = JSON.stringify({});


describe('Activate Component', () => {
    let fixture: ComponentFixture<ActivateComponent>;
    //let component: ActivateComponent;
    let mockBackend: HttpTestingController;

    const activationKey = 'abcdef';

    const mockStore = new TestServiceHelper.store();
    const mockAlert = new TestServiceHelper.alertService();
    const mockRoute = {
        snapshot: {
            params: {
                activationkey: activationKey
            }
        }
    }

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalFormsModule,
                //DraalSpinnerModule
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
            //component = fixture.componentInstance;
            fixture.detectChanges();

            mockBackend = TestHttpHelper.getMockBackend();

            done();
        });
    });

    it('account activation succeeds', async(() => {
        // GIVEN account activation view is opened
        fixture.detectChanges();

        // WHEN call to backend is made to enable account
        mockBackend.expectOne(rootApi).flush(responses[rootApi]);
        const expectedUrl = activateUrl.replace(':activationkey', activationKey);
        mockBackend.expectOne(expectedUrl).flush(responses[activateUrl]);
        mockBackend.verify();

        // THEN user is directed to login page on success
        const action = <GoAction>mockStore.getDispatchAction();
        expect(action.payload.path).toEqual(['/auth/login']);

        // AND notification message is shown to user
        expect(mockAlert.getCallsCount('success')).toEqual(1);
    }));
});
