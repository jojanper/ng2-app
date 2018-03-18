import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';

import { DraalServicesModule, ApiService, AppEventsService, AppEventTypes } from '../services';
import { AppComponent } from './app.component';
import { DraalAlertModule, SideMenuComponent, BreadcrumbComponent,
    DropDownComponent, UserMenuComponent } from '../widgets';
import { DraalAppHeaderComponent, DraalAppFooterComponent } from '../pages';
import { TestServiceHelper, TestObservablesHelper } from '../../test_helpers';
import * as AuthActions from '../rx/auth';


const testModuleDef = (events: any, mockApi: any, mockStore: any) => {
    return {
        imports: [
            RouterTestingModule,
            DraalAlertModule.forRoot(),
            DraalServicesModule.forRoot()
        ],
        declarations: [
            DraalAppHeaderComponent, DraalAppFooterComponent, AppComponent,
            SideMenuComponent, BreadcrumbComponent, DropDownComponent,
            UserMenuComponent
        ],
        providers: [
            provideRoutes([]),
            {provide: Store, useValue: mockStore},
            {provide: AppEventsService, useValue: events},
            {provide: ApiService, useValue: mockApi},
        ]
    };
};

describe('App Component', () => {

    const mockApi = {};
    let fixture: ComponentFixture<AppComponent>;

    const events = new AppEventsService();
    const authStatus = new TestObservablesHelper.getUserAuthenticationStatus();
    const mockStore = new TestServiceHelper.store([authStatus.observable]);

    beforeEach(done => {
        const ref = testModuleDef(events, mockApi, mockStore);
        TestBed.configureTestingModule(ref).compileComponents().then(() => {
            fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('user cookie is loaded on start up', () => {
        const action = <AuthActions.UserCookieLoadAction>mockStore.getDispatchAction(0);
        expect(action.type).toEqual(AuthActions.ActionTypes.LOAD_AUTH_COOKIE);
    });

    it('should have an url', () => {
        expect(fixture.debugElement.componentInstance.url).toEqual('https://github.com/jojanper/angular-app');
    });

    it('sidemenu event changes UI layout', () => {
        expect(fixture.componentInstance.sidemenuCls).toEqual('');
        expect(fixture.componentInstance.contentCls).toEqual('col-sm-12');

        // New side menu links should affect the UI layout
        events.sendEvent(AppEventTypes.SIDEMENU, {menuItems: [{foo: 'bar'}]});
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(fixture.componentInstance.sidemenuCls).toEqual('col-sm-2');
            expect(fixture.componentInstance.contentCls).toEqual('col-sm-10');
        });
    });
});
