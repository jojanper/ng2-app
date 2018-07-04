import { TestBed, fakeAsync, getTestBed, tick } from '@angular/core/testing';
import { Router, provideRoutes } from '@angular/router';

import { RouterService } from './router.service';
import { TestServiceHelper } from '../../../test_helpers';
import { RouteConfig, RouteDetails } from '../../models';


const LAZYROUTES: RouteDetails = {
    url: 'lazy-app',
    children: [
        {
            url: 'view-1',
            name: 'lazy-view.view-1'
        }
    ]
};

const MOCK_ROUTES: RouteConfig = [
    {
        url: '',
        name: 'home-view'
    },
    {
        url: 'lazy-view'
    }
];

const MENU_LEFT = ['home-view'];


describe('RouterService', () => {
    let service: RouterService;

    const mockRouter = new TestServiceHelper.RouterStub();

    beforeEach(done => {
        TestBed.configureTestingModule({
            providers: [
                RouterService,
                provideRoutes([]),
                {provide: Router, useValue: mockRouter}
            ]
        }).compileComponents().then(() => {
            service = getTestBed().get(RouterService);
            service.setInitialRoutes(MOCK_ROUTES, MENU_LEFT);
            done();
        });
    });

    it('supports topMenuItems', fakeAsync(() => {
        const routes = service.topMenuItems('left');
        expect(routes.length).toEqual(1);
        expect(routes[0].url).toEqual('/');
    }));

    it('supports resolveByName', fakeAsync(() => {
        const url = service.resolveByName('home-view');
        expect(url).toEqual('/');
    }));

    it('route config is loaded', fakeAsync(() => {
        // Application routes are loaded under this path
        const route = {
            path: 'lazy-view'
        };

        // Router config after change detection has been executed
        const config = [
            Object.assign({}, route, {
                _loadedConfig: {
                    routes: [{
                        children: [{
                            data: {
                                config: {
                                    route: LAZYROUTES
                                }
                            }
                        }]
                    }]
                }
            })
        ];

        // GIVEN initial application route contains lazy-loaded views

        // WHEN lazy-loaded views are loaded
        mockRouter.setRouteConfig(config);
        mockRouter.triggerRouteConfigLoadEndEvent(route);
        tick();

        // THEN URLs under lazy-loaded views can be resolved
        const url = service.resolveByName('lazy-view.view-1');
        expect(url).toEqual('/lazy-view/lazy-app/view-1');
    }));
});
