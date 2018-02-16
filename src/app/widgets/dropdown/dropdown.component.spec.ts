import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { DropDownComponent, DropdownItem } from './dropdown.component';

const transcludeText = 'Testing transclude';
const html = `
    <dng-dropdown [menuItems]="menuItems">
        <div class="dropdown-component-avatar">${transcludeText}</div>
    </dng-dropdown>`;

@Component({
    selector: 'dng-dropdown-test',
    template: html
})
class TestDropDownComponent {
    callbackCalled = false;
    menuItems: Array<DropdownItem>;

    constructor() {
        this.menuItems = [
            DropdownItem.createAsLink({
                url: 'http://google.fi',
                title: 'Google'
            }),
            DropdownItem.createAsDivider(),
            DropdownItem.createAsCallback({
                url: '',
                title: 'Foo'
            }, () => {
                this.callbackCalled = true;
            })
        ];
    }
}

describe('DropDownComponent', () => {
    let fixture: ComponentFixture<TestDropDownComponent>;
    let component: TestDropDownComponent;

    beforeEach(done => {
        TestBed.configureTestingModule({
            imports: [CommonModule],
            declarations: [DropDownComponent, TestDropDownComponent],
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(TestDropDownComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            done();
        });
    });

    it('contains specified items', done => {
        const nativeEl = fixture.nativeElement;
        fixture.whenStable().then(() => {
            const el = nativeEl.querySelectorAll('.dropdown-component-avatar')[0];
            expect(el.textContent).toEqual(transcludeText);

            expect(nativeEl.querySelectorAll('a').length).toEqual(2);
            done();
        });
    });

    it('callback item is clicked', done => {
        fixture.whenStable().then(() => {
            let el = fixture.nativeElement.querySelectorAll('a')[1];
            el.click();
            fixture.detectChanges();
            return fixture.whenStable();
        }).then(() => {
            expect(component.callbackCalled).toBeTruthy();
            done();
        });
    });
});
