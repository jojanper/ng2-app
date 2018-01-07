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

    it('side menu links are created', () => {
        mockActivatedRoute.setChildren([routeWithConfigData]);
        mockRouter.triggerNavEndEvents('/foo/16');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(2);

            const links = fixture.nativeElement.querySelectorAll('a');

            let value = links[0].getAttribute('ng-reflect-router-link');
            expect(value).toEqual('/foo/16/history');
            expect(links[0].textContent.trim()).toEqual('History');

            value = links[1].getAttribute('ng-reflect-router-link');
            expect(value).toEqual('/foo/16/events');
            expect(links[1].textContent.trim()).toEqual('Events');
        });
    });
});
