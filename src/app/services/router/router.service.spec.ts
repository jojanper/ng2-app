import { TestBed, tick, fakeAsync, getTestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterService } from './router.service';
import { TestServiceHelper } from '../../../test_helpers';


const MOCK_ROUTES = {
    home: {
        url: '',
        name: 'home-view'
    }
};

const MENU_LEFT = ['home-view'];


describe('RouterService', () => {
    let service: RouterService;

    const mockRouter = new TestServiceHelper.RouterStub();

    beforeEach(done => {
        TestBed.configureTestingModule({
            providers: [
                RouterService,
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
});
