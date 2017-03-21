import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import 'jquery';
import 'datatables.net';
declare var $: any;

/**
 * Until Bootstrap 4 is officially supported by DataTables, use local copy of the bootstrap plugin.
 *
 * https://datatables.net/examples/styling/bootstrap4.html
 *
 * NOTE: The datatables.net-bs/js/dataTables.bootstrap.js need to be modified also to work with bootstrap alpha.6;
 *     see https://github.com/DataTables/DataTablesSrc/commit/dbc18cabe53bc20369e24e30d2d1c151f68b6190,
 *     use https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap4.js as basis for modifications.
 */
// import 'datatables.net-bs';
import './datatable.bootstrap4';

@Component({
    selector: 'dng2-dt',
    template: require('./datatable.component.html')
})
export class WidgetDtComponent implements AfterViewInit {
    @ViewChild('dtElem') el: ElementRef;
    @ViewChild('dtElem2') el2: ElementRef;

    ngAfterViewInit() {
        $(this.el.nativeElement).DataTable();

        const options: any = {
            columns: [
                {
                    title: 'Test',
                    data: 'name'
                }
            ],
            data: [
                {name: 'A'},
                {name: 'B'}
            ]
        };
        $(this.el2.nativeElement).DataTable(options);
    }
}
