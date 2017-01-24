import { TestBed, ComponentFixture } from '@angular/core/testing';

import { AlertService } from '../shared';
import { AlertComponent } from './alert.component';


describe('Alert Component', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;

  beforeEach(done => {
    TestBed.configureTestingModule({
      declarations: [AlertComponent],
      providers: [AlertService]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AlertComponent);
      component = fixture.componentInstance;
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
        const selector = fixture.nativeElement.querySelectorAll('.alert');

        // THEN all messages should be visible
        expect(selector.length).toEqual(4);

        // AND message content is as expected
        expect(selector[0].textContent).toEqual('Message1');
        expect(selector[1].textContent).toEqual('Message2');
        expect(selector[2].textContent).toEqual('Message3');
        expect(selector[3].textContent).toEqual('Message4');

        done();
    });
  });
});
