import { async, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { LogoutComponent } from './logout.component';
import { LogoutAction } from '../../../rx/auth';
import { TestServiceHelper } from '../../../../test_helpers';
import { AuthTestingModule } from '../auth.spec';


describe('Logout Component', () => {
    let fixture: ComponentFixture<LogoutComponent>;

    const mockStore = new TestServiceHelper.store();

    beforeEach(done => {
        mockStore.reset();

        const authTestingModule = new AuthTestingModule();

        authTestingModule.init([
            {provide: Store, useValue: mockStore}
        ]).then(() => {
            fixture = authTestingModule.getComponent(LogoutComponent);
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
