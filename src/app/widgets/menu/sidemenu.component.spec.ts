import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRoutes, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { SideMenuComponent } from './sidemenu.component';
import { TestServiceHelper } from '../../../test_helpers';
import { AppEventsService } from '../../services';
import { routeWithConfigData } from './breadcrumb.component.spec';


describe('SideMenuComponent Component', () => {

    let fixture: ComponentFixture<SideMenuComponent>;

    const mockRouter = new TestServiceHelper.RouterStub();
    const mockActivatedRoute = new TestServiceHelper.ActivatedRouteStub();

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [SideMenuComponent],
            providers: [
                provideRoutes([]),
                AppEventsService,
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: Router, useValue: mockRouter}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(SideMenuComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('default view for root URL', () => {
        expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(0);
    });

    /*
    it('navigation end event is triggered', () => {
        mockRouter.triggerNavEndEvents('/');
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('li').length).toEqual(1);
        });
    });

    it('routes should not be visible in breadcrumb', () => {
        mockActivatedRoute.setChildren([routeNoPrimaryOutlet, routeNoConfigData]);
        mockRouter.triggerNavEndEvents('/');
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('li').length).toEqual(1);
        });
    });
    */

    it('side menu links are constructed', () => {
        mockActivatedRoute.setChildren([routeWithConfigData]);
        mockRouter.triggerNavEndEvents('/foo/16');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(2);
            expect(fixture.nativeElement.querySelectorAll('a')[0].href).toEqual('http://localhost:9876/');
            //expect(fixture.nativeElement.querySelectorAll('li')[1].textContent.trim()).toEqual('Foo');
            //expect(fixture.nativeElement.querySelectorAll('li')[2].textContent.trim()).toEqual('16');
        });
    });
});
