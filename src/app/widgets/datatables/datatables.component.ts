import { Component, ViewChild, ElementRef, AfterViewInit, Directive, ContentChildren, QueryList, Input } from '@angular/core';
import 'jquery';
import 'datatables.net';
declare const $: any;

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
import './datatables.bootstrap4';


/**
 * Simple directive that is used to indicate column data for the datatable component.
 */
@Directive({
    selector: '[dngDtColumnDirective]',
})
export class DataTablesColumnDirective {

    constructor(private el: ElementRef) {}

    getAttributes(): any {
        const attr = {};

        const attributes = this.el.nativeElement.attributes;
        for (let i = 0; i < attributes.length; i++) {
            if (attributes[i].name.startsWith('dt-')) {
                attr[attributes[i].name.replace('dt-', '')] = attributes[i].value;
            }
        }

        return attr;
    }
}

@Component({
    selector: 'dng-dt',
    template: require('./datatables.component.html')
})
export class DataTablesComponent implements AfterViewInit {
    @Input() tableData?: any;
    @Input() tableOptions?: any;
    @Input() staticRender? = false;
    @ViewChild('dtElem') el: ElementRef;
    @ContentChildren(DataTablesColumnDirective) rows: QueryList<DataTablesColumnDirective>;

    protected options = {};

    ngAfterViewInit() {

        // Get the datatable column attributes from child components
        const rowAttr = this.rows.map(row => {
            return row.getAttributes();
        });

        this.options['columns'] = rowAttr;

        // Unless the table HTML is created, DataTables needs the data for the table
        if (!this.staticRender) {
            this.options['data'] = this.tableData;
        }

        // Create DataTables
        $(this.el.nativeElement).DataTable(this.options);
    }

    protected createColumnHTML(data: any, key: string): string {
        return data[key];
    }
}
