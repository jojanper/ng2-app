import { inject, TestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';

describe('AlertService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({providers: [AlertService]});
  });

  function createAlertMessage(service: any, msg: string, type: string, length = 1) {
      service[type](msg);
      service.alerts.subscribe((item) => {
          expect(item.length).toEqual(length);
          expect(item[0].type).toEqual(type);
          expect(item[0].text).toEqual(msg);
      });
  }

  it('supports success', inject([AlertService], (service) => {
      createAlertMessage(service, 'msg1', 'success');
  }));

  it('supports info', inject([AlertService], (service) => {
      createAlertMessage(service, 'msg2', 'info');
  }));

  it('supports warning', inject([AlertService], (service) => {
      createAlertMessage(service, 'msg3', 'warning');
  }));

  it('supports error', inject([AlertService], (service) => {
      createAlertMessage(service, 'msg4', 'error');
  }));

  it('supports removeAll', inject([AlertService], (service) => {
      let count = 0;
      const msg = 'Error message';

      service.alerts.subscribe((items) => {
          if (count === 0) {
              expect(items.length).toEqual(0);
          } else if (count === 1) {
              expect(items.length).toEqual(1);
              expect(items[0].text).toEqual(msg);
          } else {
              expect(items.length).toEqual(0);
          }
          count++;
      });

      service.error(msg);
      service.removeAll();
      expect(count).toEqual(3);
  }));
});
