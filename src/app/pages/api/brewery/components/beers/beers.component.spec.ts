import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { Store, StoreModule, combineReducers } from '@ngrx/store';

import { BeersComponent } from './beers.component';
import { DraalWidgetsCoreModule } from '../../../../../widgets';
import { NetworkService, AlertService } from '../../../../../services';
import { TestHttpHelper, TestServiceHelper } from '../../../../../../test_helpers';
import { reducers } from '../../store';
import * as Actions from '../../store/actions';


const URL = 'https://api.punkapi.com/v2/beers?page=1';
const DATA = [
    {
        name: 'foo',
        tagline: 'bar',
        description: 'foobar'
    }
];

describe('BeersComponent', () => {
    let store;
    let component: BeersComponent;
    let fixture: ComponentFixture<BeersComponent>;
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(async(() => {
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
                {provide: AlertService, useValue: mockAlert},
            ]
        })
        .compileComponents().then(() => {
            fixture = TestBed.createComponent(BeersComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            store = TestBed.get(Store);
            spyOn(store, 'dispatch').and.callThrough();
            mockBackend = TestHttpHelper.getMockBackend();
            mockBackend.expectOne(URL).flush(DATA);
            mockBackend.verify();
        });
    }));

    it('should create', fakeAsync(() => {
        // Store action is called
        const ncalls = store.dispatch.calls.count();
        expect(ncalls).toEqual(1);

        // Action saves received beer data
        const action = new Actions.SaveAction({beers: DATA, page: 1});
        const storeAction = store.dispatch.calls.argsFor(0)[0];
        expect(storeAction.type).toEqual(action.type);
        expect(storeAction.payload.beers).toEqual(action.payload.beers);
        expect(storeAction.payload.page).toEqual(2);
    }));
});
