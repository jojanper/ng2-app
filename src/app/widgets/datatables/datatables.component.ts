import { Component, ViewChild, ElementRef, AfterViewInit, Directive,
    ContentChildren, QueryList, Input } from '@angular/core';
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


const camelCase = (input) => {
    return input.toLowerCase().replace(/-(.)/g, (_match, group1) => {
        return group1.toUpperCase();
    });
};

const parseAttributes = (attributes, attributesMap) => {
    const attr = {};
    for (let i = 0; i < attributes.length; i++) {
        if (attributes[i].name.startsWith('dt-')) {
            const name = attributes[i].name.replace('dt-', '');
            attr[camelCase(name)] = attributes[i].value;
        }
    }

    attributesMap.boolean.forEach(element => {
        if (attr.hasOwnProperty(element)) {
            attr[element] = (attr[element] === 'true') ? true : false;
        }
    });

    return attr;
};

const tableAttributesAsBoolean = ['serverSide'];

const tableAttributes = {
    boolean: tableAttributesAsBoolean
};

/**
 * Simple directive that is used to indicate column data for the datatable component.
 */
@Directive({
    selector: '[dngDtColumnDirective]',
})
export class DataTablesColumnDirective {

    constructor(private el: ElementRef) {}

    getAttributes(): any {
        return parseAttributes(this.el.nativeElement.attributes, tableAttributes);
    }
}

@Component({
    selector: 'dng-dt',
    template: require('./datatables.component.html')
})
export class DataTablesComponent implements AfterViewInit {
    @Input() tableData?: any;
    @Input() tableOptions?: any;
    @ViewChild('dtElem') el: ElementRef;
    @ContentChildren(DataTablesColumnDirective) rows: QueryList<DataTablesColumnDirective>;

    @Input() dtRender: Function;

    protected options = {};

    constructor(private mainEl: ElementRef) {}

    ngAfterViewInit() {

        const optionsAttr = parseAttributes(this.mainEl.nativeElement.attributes, tableAttributes);
        this.options = Object.assign(this.options, optionsAttr);

        // Get the datatable column attributes from child components
        const rowAttr = this.rows.map(row => {
            const columnData = row.getAttributes();

            if (columnData.render) {
                const target = columnData.render;

                columnData.data = (tableRow) => {
                    return tableRow;
                };

                columnData.render = (tableRow): string => {
                    return this.dtRender({target, row: tableRow});
                };
            }

            return columnData;
        });

        this.options['columns'] = rowAttr;

        if (this.tableData) {
            this.options['data'] = this.tableData;
        } else {
            // Load data for the table's content from an Ajax source
            this.options['ajax'] = (data, callback) => {
                this.tableOptions.ajax(data, callback);
            };
        }

        // Create DataTables
        $(this.el.nativeElement).DataTable(this.options);
    }
}
