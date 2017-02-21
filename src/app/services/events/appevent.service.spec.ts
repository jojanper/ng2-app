import { inject, TestBed } from '@angular/core/testing';

import { AppEventsService } from './appevent.service';

describe('AppEventsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [AppEventsService]});
  });

  it('sendEvent fails for unsupported event', inject([AppEventsService], (service) => {
      expect(service.sendEvent()).toBeFalsy();
      expect(service.sendEvent('foo')).toBeFalsy();
  }));
});
