import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { LogoutComponent } from './logout.component';
import { AppEventsService } from '../../../services';
import { TestServiceHelper } from '../../../../test_helpers';


describe('Logout Component', () => {
  let fixture: ComponentFixture<LogoutComponent>;

  let userRemoved = false;
  let mockCookie = {
      remove: (_key: string) => {
          userRemoved = true;
      }
  };

  const mockRouter = new TestServiceHelper.router();

  let eventSend = false;
  let mockEvents = {
      sendEvent: () => {
          eventSend = true;
      }
  };

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [LogoutComponent],
      providers: [
          {provide: CookieService, useValue: mockCookie},
          {provide: Router, useValue: mockRouter},
          {provide: AppEventsService, useValue: mockEvents}
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LogoutComponent);
      fixture.detectChanges();
      done();
    });
  });

  it('sign-out is performed', async(() => {
      // WHEN user calls sign-out component
      fixture.whenStable().then(() => {

          // THEN user is directed to login page
          expect(mockRouter.getNavigateUrl()).toEqual('/auth/login');

          // AND no authentication data is available for user
          expect(userRemoved).toBeTruthy();

          // AND logout event has been sent
          expect(eventSend).toBeTruthy();
      });
  }));
});
