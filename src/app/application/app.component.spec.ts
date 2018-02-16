import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRoutes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { DraalServicesModule, ApiService, AppEventsService, AppEventTypes } from '../services';
import { AppComponent } from './app.component';
import { DraalAlertModule, SideMenuComponent, BreadcrumbComponent,
    DropDownComponent } from '../widgets';
import { DraalAppHeaderComponent, DraalAppFooterComponent } from '../pages';


const testModuleDef = (events: any, mockApi: any) => {
    return {
        imports: [RouterTestingModule, DraalAlertModule.forRoot(), DraalServicesModule.forRoot()],
        declarations: [DraalAppHeaderComponent, DraalAppFooterComponent, AppComponent,
            SideMenuComponent, BreadcrumbComponent, DropDownComponent],
        providers: [
            provideRoutes([]),
            {provide: AppEventsService, useValue: events},
            {provide: ApiService, useValue: mockApi},
        ]
    };
};

describe('App Component', () => {

    const mockApi = {};
    const events = new AppEventsService();

    let fixture: ComponentFixture<AppComponent>;

    beforeEach(done => {
        const ref = testModuleDef(events, mockApi);
        TestBed.configureTestingModule(ref).compileComponents().then(() => {
            fixture = TestBed.createComponent(AppComponent);
            fixture.detectChanges();
            done();
        });
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
