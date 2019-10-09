import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfiniteScrollComponent } from './infinitescroll.component';
import { ScrollerDirective } from './scroll.directive';
import { SpinnerComponent } from '../spinner';
import { AppObservableObject } from '../../utils/base/base.observable';
import { timer } from '../../utils';


export class BooleanValueObserver extends AppObservableObject<boolean> { }

@Component({
    selector: 'dng-infinite-scroll-test',
    template: '<dng-infinite-scroll [list]="list" [scrollCb]="scrollCb"></dng-infinite-scroll>'
})
class TestInfiniteScrollComponent {
    list = [];
    scrollCb: Function;
    observer = new BooleanValueObserver();

    constructor() {
        const observable = this.observer.asPipe();
        this.scrollCb = () => observable;
    }

    setListData() {
        this.list.push('foo');
        this.observer.setObject(true);
    }
}

describe('InfiniteScrollComponent', () => {
    let component: TestInfiniteScrollComponent;
    let fixture: ComponentFixture<TestInfiniteScrollComponent>;

    beforeEach((done) => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule
            ],
            declarations: [
                SpinnerComponent,
                ScrollerDirective,
                InfiniteScrollComponent,
                TestInfiniteScrollComponent
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(TestInfiniteScrollComponent);
            component = fixture.componentInstance;
            spyOn(component, 'scrollCb').and.callThrough();
            done();
        });
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('supports infinite scroll', async () => {
        fixture.detectChanges();

        const childEl = fixture.debugElement.query(By.css('dng-infinite-scroll'));

        // Initially loading state is disabled
        expect(childEl.componentInstance.loading).toBeFalsy();

        // Scroll down to the bottom to trigger new data loading request
        document.body.style.height = '2000px';
        window.scroll(0, 1500);
        document.dispatchEvent(new Event('scroll'));

        await timer(250);

        // Data is being loaded
        expect(childEl.componentInstance.loading).toBeTruthy();

        // After data has been loaded, loading state is back disabled state
        component.setListData();
        expect(childEl.componentInstance.loading).toBeFalsy();
    });
});
