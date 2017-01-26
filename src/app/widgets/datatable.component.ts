import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs';

@Component({
    selector: 'dng2-dt',
    template: require('./datatable.component.html')
})
export class WidgetDtComponent implements AfterViewInit {
    @ViewChild('dtElem') el: ElementRef;

    ngAfterViewInit() {
        $(this.el.nativeElement).DataTable();
    }
}
