import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import { BeersComponent } from './beers.component';
import { DraalWidgetsCoreModule } from '../../../../../widgets';
import { NetworkService, AlertService } from '../../../../../services';
import { TestHttpHelper, TestServiceHelper } from '../../../../../../test_helpers';
import { timer } from '../../../../../utils';
import { reducers } from '../../store';
import * as Actions from '../../store/actions';


const URL = 'https://api.punkapi.com/v2/beers?page=1';
const URL2 = 'https://api.punkapi.com/v2/beers?page=2';

// Prepare enough mock beer data
const DATA = [];
for (let i = 0; i < 40; i++) {
    DATA.push({
        name: `foo-${i}`,
        tagline: `bar-${i}`,
        description: `foobar-${i}`,
    });
}

describe('BeersComponent', () => {
    let store;
    let component: BeersComponent;
    let fixture: ComponentFixture<BeersComponent>;
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach((done) => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                DraalWidgetsCoreModule,
                StoreModule.forRoot({
                    'brewery': combineReducers(reducers)
                })
            ].concat(TestHttpHelper.http),
            declarations: [
                BeersComponent
            ],
            providers: [
                NetworkService,
                { provide: AlertService, useValue: mockAlert },
            ]
        })
            .compileComponents().then(() => {
                fixture = TestBed.createComponent(BeersComponent);
                component = fixture.componentInstance;

                store = TestBed.get(Store);
                spyOn(store, 'dispatch').and.callThrough();
                spyOn(component, 'scrollCb').and.callThrough();
                done();
            });
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('supports infinite scroll', async (done) => {
        fixture.detectChanges();

        // Expect initial data loading request
        mockBackend = TestHttpHelper.getMockBackend();
        mockBackend.expectOne(URL).flush(DATA);
        mockBackend.verify();

        fixture.detectChanges();

        // Scroll down to the bottom to trigger new data loading request
        document.body.style.height = '2000px';
        window.scroll(0, 1500);
        document.dispatchEvent(new Event('scroll'));

        fixture.detectChanges();

        // Scroll debounce time
        await timer(105);

        // Store action was called for initial data load
        const ncalls = store.dispatch.calls.count();
        expect(ncalls).toEqual(1);

        // Action saves received beer data
        const action = Actions.saveAction({ beers: DATA, page: 1 });
        const storeAction = store.dispatch.calls.argsFor(0)[0];
        expect(storeAction.type).toEqual(action.type);
        expect(storeAction.beers).toEqual(action.beers);
        expect(storeAction.page).toEqual(2);

        fixture.detectChanges();
        await fixture.whenStable();

        // Expect new data loading request triggered by the scroll event
        mockBackend.expectOne(URL2).flush(DATA);
        mockBackend.verify();

        fixture.detectChanges();
        await fixture.whenStable();

        // Data fetching delay
        await timer(800);

        // Scroll callback function was called
        expect(component.scrollCb['calls'].count()).toEqual(1);

        // Next data to be requested is for page 3
        expect(component.page).toEqual(3);

        // Expected amount of data has been loaded
        expect(component.list.length).toEqual(2 * DATA.length);

        done();
    });
});
