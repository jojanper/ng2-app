import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DemoComponent } from './demo.component';
import { DraalAppPagesModule } from '../index';
import { AlertService } from '../../services';


describe('Demo Component', () => {
  let fixture: ComponentFixture<DemoComponent>;
  let component: DemoComponent;

  function clickTab(tabIndex) {
    const tab = fixture.nativeElement.querySelectorAll('li.nav-item a')[tabIndex];
    tab.click();
    fixture.detectChanges();
  }

  let alertCalls = {};
  let mockAlertService = {
    success: () => {
      alertCalls['success'] = true;
    },
    info: () => {
      alertCalls['info'] = true;
    },
    warning: () => {
      alertCalls['warning'] = true;
    },
    error: () => {
      alertCalls['error'] = true;
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [NgbModule.forRoot(), DraalAppPagesModule.forRoot()],
      providers: [
        {provide: AlertService, useValue: mockAlertService},
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(DemoComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should have 5 tabs', async(() => {
    // GIVEN demo page
    // WHEN building demo component
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // THEN page should have title
      expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Collection of UI components');

      // AND 5 tabs
      expect(fixture.nativeElement.querySelectorAll('li.nav-item').length).toEqual(5);
    });
  }));

  it('2nd tab is selected', async(() => {
    // GIVEN demo page
    fixture.detectChanges();

    // WHEN clicking second tab
    clickTab(1);

    // THEN chosen plugin should be visible
    fixture.whenStable().then(() => {
        expect(fixture.nativeElement.querySelectorAll('dng2-app-form').length).toEqual(1);
    });
  }));

  it('3rd tab is selected', async(() => {
    // GIVEN demo page
    fixture.detectChanges();

    // WHEN clicking third tab
    clickTab(2);

    // THEN chosen plugin should be visible
    fixture.whenStable().then(() => {
        expect(fixture.nativeElement.querySelectorAll('dng2-dt').length).toEqual(1);
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
        expect(alertCalls[alertType]).toBeTruthy();
      });
    }
});
