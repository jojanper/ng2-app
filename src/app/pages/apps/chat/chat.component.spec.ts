import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

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

    it('should show message typing input', done => {
        fixture.whenStable().then(() => {
            expect(fixture.nativeElement.querySelectorAll('form input').length).toEqual(1);
            done();
        });
    });

    fit('user sends message', async(() => { //done => {
        //let input;
        const testMessage = 'My test message';

        fixture.whenStable().then(() => {
            // Enter user input
            //console.log(fixture.nativeElement);
            const input = fixture.nativeElement.querySelectorAll('input')[0];
            console.log('DONE');
            return sendInput(fixture, input, testMessage);
        }).then(() => {
            console.log('DONE 1');
            // Send message
            //const button = fixture.nativeElement.querySelector('form button');
            //const element = fixture.nativeElement.querySelector('input');
            //const input = fixture.nativeElement.querySelectorAll('form input')[0];
            const input = fixture.debugElement.query(By.css('form input'));
            console.log(input);
            /*
            input.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'ENTER'
            }));
            input.dispatchEvent(new KeyboardEvent('keypress', {
                key: 'Enter',
                code: 'ENTER'
            }));
            input.dispatchEvent(new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'ENTER'
            }));
            */
            input.triggerEventHandler('keyup.enter', {});
            //button.click();
            //new KeyboardEvent('keypress', { key: 'Enter' })
            //inputElement.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            console.log('DONE 2');
            return fixture.whenStable();
        }).then(() => {
            console.log('DONE 3');
            // Message is visible
            const messages = fixture.nativeElement.querySelectorAll('.card');
            expect(messages.length).toEqual(1);

            console.log('DONE 4');

            // And message content matches the expected
            const text = messages[0].querySelectorAll('.card-text')[0].textContent;
            expect(text).toEqual(testMessage);
            console.log('DONE 5');
            //done();
        }).catch(err => {
            throw new Error(err);
        });
    }));
});
