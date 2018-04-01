import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { LogoutComponent } from './logout.component';
import { LogoutAction } from '../../../rx/auth';
import { DraalWidgetsCoreModule } from '../../../widgets';
import { AlertService } from '../../../services';
import { TestServiceHelper } from '../../../../test_helpers';


describe('Logout Component', () => {
    let fixture: ComponentFixture<LogoutComponent>;

    const mockStore = new TestServiceHelper.store();

    beforeEach(done => {
        mockStore.reset();

        TestBed.configureTestingModule({
            imports: [
                NgbModule.forRoot(),
                DraalWidgetsCoreModule
            ],
            declarations: [LogoutComponent],
            providers: [
                AlertService,
                {provide: Store, useValue: mockStore},
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(LogoutComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('sign-out is performed', async(() => {
        // WHEN user calls sign-out component
        fixture.whenStable().then(() => {
            // THEN logout action is triggered
            const action = <LogoutAction>mockStore.getDispatchAction(0);
            expect(action.type).toEqual(new LogoutAction().type);
        });
    }));
});
