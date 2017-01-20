import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { LogoutComponent } from './logout.component';


describe('Logout Component', () => {
  let fixture: ComponentFixture<LogoutComponent>;
  let component: LogoutComponent;

  let userRemoved = false;
  let mockCookie = {
      remove: (key: string) => {
          userRemoved = true;
      }
  };

  let url = null;
  let mockRouter = {
      navigate: (returnUrl) => {
          url = returnUrl;
      }
  };

  beforeEach(done => {
    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot()],
      declarations: [LogoutComponent],
      providers: [
          {provide: CookieService, useValue: mockCookie},
          {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LogoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      done();
    });
  });

  it('sign-out is performed', async(() => {
      // WHEN user calls sign-out component
      fixture.whenStable().then(() => {

          // THEN user is directed to login page
          expect(url).toEqual(['/login']);

          // AND no authentication data is available for user
          expect(userRemoved).toBeTruthy();
      });
  }));
});
