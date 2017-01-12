import {Component, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import * as $ from 'jquery';
import 'chosen-js';

@Component({
    selector: 'dng2-chosen',
    template: `<h1>Option</h1>
        <select #selectElem>
        <option *ngFor="let item of items" [value]="item" [selected]="item === selectedValue">{{item}} option</option>
        </select>
        <h4> {{selectedValue}}</h4>`
})
export class WidgetChosenComponent implements AfterViewInit {
    @ViewChild('selectElem') el: ElementRef;
    items = ['First', 'Second', 'Third'];
    selectedValue = 'Second';

    ngAfterViewInit() {
        $(this.el.nativeElement)
            .chosen()
            .on('change', (e, args) => {
                this.selectedValue = args.selected;
            });
    }
}
