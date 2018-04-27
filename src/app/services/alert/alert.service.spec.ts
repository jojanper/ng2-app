import { TestBed, tick, fakeAsync, getTestBed } from '@angular/core/testing';

import { AlertService } from './alert.service';


describe('AlertService', () => {
    let service: AlertService;

    beforeEach(done => {
        TestBed.configureTestingModule({
            providers: [AlertService]
        }).compileComponents().then(() => {
            service = getTestBed().get(AlertService);
            done();
        });
    });

    function createAlertMessage(msg: string, type: string, length = 1) {
        service[type](msg);
        service.alerts.subscribe((item) => {
            expect(item.length).toEqual(length);
            expect(item[0].type).toEqual(type);
            expect(item[0].text).toEqual(msg);
        });
    }

    it('supports success', fakeAsync(() => {
        createAlertMessage('msg1', 'success');
    }));

    it('supports info', fakeAsync(() => {
        createAlertMessage('msg2', 'info');
    }));

    it('supports warning', fakeAsync(() => {
        createAlertMessage('msg3', 'warning');
    }));

    it('supports error', fakeAsync(() => {
        createAlertMessage('msg4', 'error');
    }));

    it('supports timeout option', fakeAsync(() => {
        const options = {timeout: 1000};
        const msg = 'Timeout message';
        service.success(msg, options);

        const messages = [];
        service.alerts.subscribe(items => messages.push(Object.assign([], items)));

        tick(options.timeout);

        // 2 alert subscriptions occur, first subscription contains the message
        // and the second subcription clears the alert message.
        expect(messages.length).toEqual(2);
        expect(messages[0].length).toEqual(1);
        expect(messages[0][0].text).toEqual(msg);
        expect(messages[1].length).toEqual(0);
    }));

    it('supports removeAll', fakeAsync(() => {
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
