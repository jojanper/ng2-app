import { CommonModule } from '@angular/common';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AppFormComponent } from './form';
import { AppDialogComponent } from './dialog';
import { DemoComponent } from './demo.component';
import { DraalServicesModule, AlertService } from '../../services';
import { DraalDataTableModule, DraalAlertModule, DraalFormsModule,
  DraalWidgetsCoreModule, RouteComponent } from '../../widgets';
import { TestServiceHelper } from '../../../test_helpers';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot([{
            path: '', component: DemoComponent
        }]),
        NgbModule.forRoot(),
        DraalFormsModule,
        DraalDataTableModule,
        DraalAlertModule,
        DraalServicesModule,
        DraalWidgetsCoreModule
    ],
    declarations: [
        AppDialogComponent,
        AppFormComponent,
        DemoComponent
      ],
    entryComponents: [
        RouteComponent
    ]
})
class DemoModule {}


describe('Demo Component', () => {
    let fixture: ComponentFixture<DemoComponent>;

    function clickTab(tabIndex) {
        const tab = fixture.nativeElement.querySelectorAll('li.nav-item a')[tabIndex];
        tab.click();
        fixture.detectChanges();
    }

    const mockAlert = new TestServiceHelper.alertService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DemoModule],
            providers: [
                {provide: AlertService, useValue: mockAlert},
                {provide: APP_BASE_HREF, useValue: '/'}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(DemoComponent);
        });
    }));

    it('should have 5 tabs', async(() => {
        // GIVEN demo page
        // WHEN building demo component
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            // THEN page should have title
            expect(fixture.nativeElement.querySelector('h2').textContent)
                .toContain('Collection of UI components');

          // AND 5 tabs
          expect(fixture.nativeElement.querySelectorAll('li.nav-item').length).toEqual(5);
        });
    }));

    it('1st tab is selected', async(() => {
        // GIVEN demo page
        fixture.detectChanges();

        // WHEN clicking first tab
        clickTab(0);

        // THEN dialog button should be visible
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('dng-app-dialog').length).toEqual(1);
        });
    }));

    it('2nd tab is selected', async(() => {
        // GIVEN demo page
        fixture.detectChanges();

        // WHEN clicking second tab
        clickTab(1);

        // THEN chosen plugin should be visible
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('dng-app-form').length).toEqual(1);
        });
    }));

    it('3rd tab is selected', async(() => {
        // GIVEN demo page
        fixture.detectChanges();

        // WHEN clicking third tab
        clickTab(2);

        // THEN datatables plugin(s) should be visible
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('dng-dt').length).toEqual(3);
        });
    }));

    it('4th tab is selected', async(() => {
        // GIVEN demo page
        fixture.detectChanges();

        // WHEN clicking 4th tab
        clickTab(3);

        // THEN alert buttons should be available
        fixture.whenStable().then(() => {
            const buttons = fixture.nativeElement.querySelectorAll('button');
            expect(buttons.length).toEqual(4);

            // AND alerts messages can be created by clicking the available buttons
            createAlert(buttons[0], 'success');
            createAlert(buttons[1], 'info');
            createAlert(buttons[2], 'warning');
            createAlert(buttons[3], 'error');
        });
    }));

    function createAlert(button, alertType) {
        // WHEN creating alert messages
        button.click();
        fixture.detectChanges();

        // THEN call to alert service is made
        fixture.whenStable().then(() => {
            expect(mockAlert.getCallsCount(alertType)).toEqual(1);
        });
    }
});
