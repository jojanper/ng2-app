import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import { DraalServicesModule, ApiService, AppEventsService,
    AppEventTypes, AutoLogout } from '../services';
import { AppComponent } from './app.component';
import { DraalAlertModule, SideMenuComponent, BreadcrumbComponent,
    DropDownComponent, UserMenuComponent } from '../widgets';
import { DraalAppHeaderComponent, DraalAppFooterComponent } from '../pages';
import * as AuthActions from '../rx/auth';
import { reducers } from '../rx/rx.reducers';


const testModuleDef = (events: any, mockApi: any, mockLogout: any) => {
    return {
        imports: [
            RouterTestingModule,
            DraalAlertModule.forRoot(),
            DraalServicesModule.forRoot(),
            StoreModule.forRoot({
                'apprx': combineReducers(reducers)
            })
        ],
        declarations: [
            DraalAppHeaderComponent, DraalAppFooterComponent, AppComponent,
            SideMenuComponent, BreadcrumbComponent, DropDownComponent,
            UserMenuComponent
        ],
        providers: [
            provideRoutes([]),
            {provide: AppEventsService, useValue: events},
            {provide: ApiService, useValue: mockApi},
            {provide: AutoLogout, useValue: mockLogout}
        ]
    };
};

describe('App Component', () => {
    const mockApi = {};
    let fixture: ComponentFixture<AppComponent>;
    let store: any;

    const events = new AppEventsService();
    const mockLogout = {};

    beforeEach(done => {
        const ref = testModuleDef(events, mockApi, mockLogout);
        TestBed.configureTestingModule(ref).compileComponents().then(() => {
            store = TestBed.get(Store);
            spyOn(store, 'dispatch').and.callThrough();

            fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('user cookie is loaded on start up', () => {
        const action = store.dispatch.calls.argsFor(0)[0];
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
