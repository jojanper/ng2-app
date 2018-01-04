import { inject, TestBed } from '@angular/core/testing';

import { AppEventsService, AppEventTypes } from './appevent.service';


describe('AppEventsService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({providers: [AppEventsService]});
    });

    it('sendEvent fails for unsupported event', inject([AppEventsService], (service) => {
        expect(service.sendEvent()).toBeFalsy();
        expect(service.sendEvent('foo')).toBeFalsy();
    }));

    it('sendEvent with data', inject([AppEventsService], (service) => {

        let eventData = null;
        service.getObservable(AppEventTypes.LOGOUT).subscribe(_data => eventData = _data);

        const data = {foo: true};
        service.sendEvent(AppEventTypes.LOGOUT, data);
        expect(eventData.data).toEqual(data);
    }));

    it('sidemenu event', inject([AppEventsService], (service) => {

        let eventData = null;
        service.getObservable(AppEventTypes.SIDEMENU).subscribe(_data => eventData = _data);

        const data = {menuItems: []};
        service.sendEvent(AppEventTypes.SIDEMENU, data);
        expect(eventData.data).toEqual(data);
    }));
});
