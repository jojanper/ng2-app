import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { BeersComponent } from './beers.component';
import { DraalWidgetsCoreModule } from '../../../../../widgets';
import { NetworkService, AlertService } from '../../../../../services';
import { TestHttpHelper, TestServiceHelper } from '../../../../../../test_helpers';


describe('BeersComponent', () => {
    let component: BeersComponent;
    let fixture: ComponentFixture<BeersComponent>;
    let mockBackend: HttpTestingController;

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                DraalWidgetsCoreModule,
            ].concat(TestHttpHelper.http),
            declarations: [
                BeersComponent
            ],
            providers: [
                NetworkService,
                {provide: AlertService, useValue: mockAlert},
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BeersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        mockBackend = TestHttpHelper.getMockBackend();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
