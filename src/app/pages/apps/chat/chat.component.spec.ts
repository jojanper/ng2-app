import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { RealTimeService } from './services';
import { DraalWidgetsCoreModule, AppObservableObject } from '../../../widgets';


class TestChatMessagesObservable extends AppObservableObject<any> {}


describe('Chat Component', () => {
    let fixture: ComponentFixture<ChatComponent>;

    const mockSender = new TestChatMessagesObservable();

    const mockSocket = {
        onData: () => {
            return mockSender.observable;
        },

        send: (_event, data) => {
            console.log(data);
            mockSender.setObject(data);
        }
    };

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                DraalWidgetsCoreModule,
            ],
            declarations: [ChatComponent],
            providers: [
                {provide: RealTimeService, useValue: mockSocket}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ChatComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('should message send button', done => {
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('button').length).toEqual(1);
            done();
        });
    });

    it('user sends message', done => {
        fixture.whenStable().then(() => {
            const button = fixture.nativeElement.querySelector('button');
            button.click();
            fixture.detectChanges();
            return fixture.whenStable();
        }).then(() => {
            console.log(fixture.nativeElement);
            expect(fixture.nativeElement.querySelectorAll('.card').length).toEqual(1);
            done();
        });
    });
});
