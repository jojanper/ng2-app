import { SocketService } from './socket.service';
import { AppObservableObject } from '../../../../../widgets';


class MockSocketObservable extends AppObservableObject<any> {}

/**
 * Mock client SocketIO.
 */
class MockSocket {
    event: string;
    subject: MockSocketObservable = new MockSocketObservable();

    emit(event, data) {
        this.event = event;
        this.subject.setObject(data);
    }

    on(_event, fn) {
        this.subject.observable.subscribe(data => {
            fn(data);
        });
    }
}

/**
 * Test service that overrides the socket with a mocked version.
 */
export class TestSocketService extends SocketService {
    constructor() {
        super();
        this.socket = new MockSocket();
    }
}


describe('Realtime Service', () => {
    let service: TestSocketService;

    beforeEach(() => {
        service = new TestSocketService();
    });

    it('supports sending and receiving messages', (done) => {
        let receivedData = null;
        service.onData('message').subscribe(response => {
            receivedData = response;
        });

        const sentData = {data: 'foo'};
        service.send('message', sentData);

        expect(receivedData).toEqual(sentData);

        done();
    });
});
