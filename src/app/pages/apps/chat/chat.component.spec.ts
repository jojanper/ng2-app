import { TestBed, ComponentFixture } from '@angular/core/testing';

import { ChatComponent } from './chat.component';
import { SocketService } from './services';
import { DraalWidgetsCoreModule, DraalFormsModule, AppObservableObject } from '../../../widgets';
import { TestFormHelper } from '../../../../test_helpers';


const sendInput = TestFormHelper.sendInput;
class TestChatMessagesObservable extends AppObservableObject<any> {}


describe('Chat Component', () => {
    let fixture: ComponentFixture<ChatComponent>;

    const mockSender = new TestChatMessagesObservable();

    const mockSocket = {
        onData: () => {
            return mockSender.observable;
        },

        send: (_event, data) => {
            mockSender.setObject(data);
        }
    };

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [
                DraalWidgetsCoreModule,
                DraalFormsModule
            ],
            declarations: [ChatComponent],
            providers: [
                {provide: SocketService, useValue: mockSocket}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(ChatComponent);
            fixture.detectChanges();
            done();
        });
    });

    it('should show send button', done => {
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('button').length).toEqual(1);
            done();
        });
    });

    it('user sends message', done => {
        const testMessage = 'My test message';

        fixture.whenStable().then(() => {
            // Enter user input
            const input = fixture.nativeElement.querySelectorAll('input')[0];
            return sendInput(fixture, input, testMessage);
        }).then(() => {
            // Click message sending button
            const button = fixture.nativeElement.querySelector('form button');
            button.click();
            fixture.detectChanges();
            return fixture.whenStable();
        }).then(() => {
            // Message is visible
            const messages = fixture.nativeElement.querySelectorAll('.card');
            expect(messages.length).toEqual(1);

            // And message content matches the expected
            const text = messages[0].querySelectorAll('.card-text')[0].textContent;
            expect(text).toEqual(testMessage);
            done();
        });
    });
});
