import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AlertService, AppEventsService, DraalServicesModule } from '../../services';
import { AlertComponent } from './alert.component';
import { DraalAlertModule } from './alert.module';


describe('Alert Component', () => {
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [DraalAlertModule.forRoot(), DraalServicesModule.forRoot()]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AlertComponent);
      fixture.detectChanges();
      done();
    });
  });

  it('should show alert messages', done => {
    // GIVEN alert service
    const alertService = fixture.debugElement.injector.get(AlertService);

    // WHEN adding alert messages to service
    alertService.success('Message1');
    alertService.info('Message2');
    alertService.warning('Message3');
    alertService.error('Message4');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
        let selector = fixture.nativeElement.querySelectorAll('.alert');

        // THEN all messages should be visible
        expect(selector.length).toEqual(4);

        // AND message content is as expected
        expect(selector[0].textContent).toEqual('Message1');
        expect(selector[1].textContent).toEqual('Message2');
        expect(selector[2].textContent).toEqual('Message3');
        expect(selector[3].textContent).toEqual('Message4');

        // WHEN clicking the 1st alert message
        selector[0].click();
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            selector = fixture.nativeElement.querySelectorAll('.alert');

            // THEN message is removed and 3 alert messages are available
            expect(selector[0].textContent).toEqual('Message2');
            expect(selector.length).toEqual(3);
        });

        done();
    });
  });

  it('should remove messages on logout', done => {
    // GIVEN alert messages are visible in UI
    const alertService = fixture.debugElement.injector.get(AlertService);
    const eventsService = fixture.debugElement.injector.get(AppEventsService);

    alertService.success('Message1');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.alert').length).toEqual(1);

    // WHEN user logs out from system
    eventsService.sendEvent('logout');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
        const selector = fixture.nativeElement.querySelectorAll('.alert');

        // THEN no messages should be visible
        expect(selector.length).toEqual(0);

        done();
    });
  });
});
