import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute, provideRoutes, Router, PRIMARY_OUTLET } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { BreadcrumbComponent } from './breadcrumb.component';
import { TestServiceHelper } from '../../../test_helpers';


const routeNoPrimaryOutlet = {
    outlet: 'foo',
    snapshot: {
        data: {}
    },
    children: []
};

const routeNoConfigData = {
    outlet: PRIMARY_OUTLET,
    snapshot: {
        data: {}
    },
    children: []
};

const routeChildData = {
    outlet: PRIMARY_OUTLET,
    snapshot: {
        url: [{path: '16'}],
        data: {
            config: {
                route: {
                    menuTitle: 'Foo details',
                    children: [
                        {
                            url: 'history',
                            menuTitle: 'History'
                        },
                        {
                            url: 'events',
                            menuTitle: 'Events'
                        }
                    ]
                }
            }
        },
        params: {id: 16}
    },
    children: []
};

export const routeWithConfigData = {
    outlet: PRIMARY_OUTLET,
    snapshot: {
        url: [{path: 'foo'}],
        data: {
            config: {
                route: {
                    menuTitle: 'Foo'
                }
            }
        },
        params: {}
    },
    children: [routeChildData, routeNoPrimaryOutlet]
};


describe('Breadcrumb Component', () => {

    let fixture: ComponentFixture<BreadcrumbComponent>;

    const mockRouter = new TestServiceHelper.RouterStub();
    const mockActivatedRoute = new TestServiceHelper.ActivatedRouteStub();

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [BreadcrumbComponent],
            providers: [
                provideRoutes([]),
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: Router, useValue: mockRouter}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(BreadcrumbComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('default view for root URL', () => {
        expect(fixture.nativeElement.querySelectorAll('li').length).toEqual(1);
    });

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

    it('multi-level breadcrumb is constructed', () => {
        mockActivatedRoute.setChildren([routeWithConfigData]);
        mockRouter.triggerNavEndEvents('/foo/16');
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('li').length).toEqual(3);
            expect(fixture.nativeElement.querySelectorAll('li')[0].textContent.trim()).toEqual('Home');
            expect(fixture.nativeElement.querySelectorAll('li')[1].textContent.trim()).toEqual('Foo');
            expect(fixture.nativeElement.querySelectorAll('li')[2].textContent.trim()).toEqual('16');
        });
    });
});
