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
//import { SpinnerComponent } from '../spinner';

/**
 * Simple directive that is used to indicate column data for the datatable component.
 */
@Directive({
    selector: '[dngDtColumnDirective]',
})
export class DataTablesColumnDirective {

    constructor(private el: ElementRef) {}

    getAttributes(): any {
        const attributes = this.el.nativeElement.attributes;

        const attr = {};
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

    //@Output() dtRender: EventEmitter<any> = new EventEmitter<any>();
    @Input() dtRender: Function;

    protected options = {};

    //constructor(private resolver: ComponentFactoryResolver, private injector: Injector) {}

    ngAfterViewInit() {

        // Get the datatable column attributes from child components
        const rowAttr = this.rows.map(row => {
            const columnData = row.getAttributes();

            if (columnData.render) {
                const target = columnData.render;

                columnData.render = (row/*, type, val, meta*/): string => {
                    //console.log(row);
                    /*
                    console.log(type);
                    console.log(val);
                    console.log(meta);
                    */
                    /*
                    const factory = this.resolver.resolveComponentFactory(SpinnerComponent);
                    const component = factory.create(this.injector);
                    const spinner: SpinnerComponent = <SpinnerComponent>component.instance;
                    spinner.type = 'spinner-2';
                    spinner.scale = '0.25';
                    //console.log(component);
                    component.changeDetectorRef.detectChanges();
                    */

                    return this.dtRender({target, row});

                    //return row + component.location.nativeElement.innerHTML;
                };
            }

            return columnData;
        });

        console.log(rowAttr);

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
