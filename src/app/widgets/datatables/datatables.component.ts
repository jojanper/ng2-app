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
import './datatables.bootstrap4';

const tableDataOrder = ['name', 'title', 'location', 'salary'];
const tableData = [
    { name: 'Tiger Nixon', title: 'System Architect', location: 'Edinburgh', salary: '$320,800' },
    { name: 'Garrett Winters', title: 'Accountant', location: 'Tokyo', salary: '$170,750' },
    { name: 'Ashton Cox', title: 'Junior Technical Author', location: 'San Francisco', salary: '$86,000' },
    { name: 'Cedric Kelly', title: 'Senior Javascript Developer', location: 'Edinburgh', salary: '$433,060' },
    { name: 'Airi Satou', title: 'Accountant', location: 'Tokyo', salary: '$162,700' },
    { name: 'Brielle Williamson', title: 'Integration Specialist', location: 'New York', salary: '$372,000' },
    { name: 'Herrod Chandler', title: 'Sales Assistant', location: 'San Francisco', salary: '$137,500' },
    { name: 'Rhona Davidson', title: 'Integration Specialist', location: 'Tokyo', salary: '$327,900' },
    { name: 'Colleen Hurst', title: 'Javascript Developer', location: 'San Francisco', salary: '$205,500' },
    { name: 'Sonya Frost', title: 'Software Engineer', location: 'Edinburgh', salary: '$103,600' },
    { name: 'Jena Gaines', title: 'Office Manager', location: 'London', salary: '$90,560' },
    { name: 'Quinn Flynn', title: 'Support Lead', location: 'Edinburgh', salary: '$342,000' },
    { name: 'Charde Marshall', title: 'Regional Director', location: 'San Francisco', salary: '$470,600' },
    { name: 'Haley Kennedy', title: 'Senior Marketing Designer', location: 'London', salary: '$313,500' },
    { name: 'Tatyana Fitzpatrick', title: 'Regional Director', location: 'London', salary: '$385,750' },
    { name: 'Michael Silva', title: 'Marketing Designer', location: 'London', salary: '$198,500' },
    { name: 'Paul Byrd', title: 'Chief Financial Officer (CFO)', location: 'New York', salary: '$725,000' },
    { name: 'Gloria Little', title: 'Systems Administrator', location: 'New York', salary: '$237,500' },
    { name: 'Bradley Greer', title: 'Software Engineer', location: 'London', salary: '$132,000' },
    { name: 'Dai Rios', title: 'Personnel Lead', location: 'Edinburgh', salary: '$217,500' },
    { name: 'Jenette Caldwell', title: 'Development Lead', location: 'New York', salary: '$345,000' },
    { name: 'Yuri Berry', title: 'Chief Marketing Officer (CMO)', location: 'New York', salary: '$675,000' },
    { name: 'Caesar Vance', title: 'Pre-Sales Support', location: 'New York', salary: '$106,450' },
    { name: 'Doris Wilder', title: 'Sales Assistant', location: 'Sidney', salary: '$85,600' },
    { name: 'Angelica Ramos', title: 'Chief Executive Officer (CEO)', location: 'London', salary: '$1,200,000' },
    { name: 'Gavin Joyce', title: 'Developer', location: 'Edinburgh', salary: '$92,575' },
    { name: 'Jennifer Chang', title: 'Regional Director', location: 'Singapore', salary: '$357,650' },
    { name: 'Brenden Wagner', title: 'Software Engineer', location: 'San Francisco', salary: '$206,850' },
    { name: 'Fiona Green', title: 'Chief Operating Officer (COO)', location: 'San Francisco', salary: '$850,000' },
    { name: 'Shou Itou', title: 'Regional Marketing', location: 'Tokyo', salary: '$163,000' },
    { name: 'Michelle House', title: 'Integration Specialist', location: 'Sidney', salary: '$95,400' },
    { name: 'Suki Burks', title: 'Developer', location: 'London', salary: '$114,500' },
    { name: 'Prescott Bartlett', title: 'Technical Author', location: 'London', salary: '$145,000' },
    { name: 'Gavin Cortez', title: 'Team Leader', location: 'San Francisco', salary: '$235,500' },
    { name: 'Martena Mccray', title: 'Post-Sales support', location: 'Edinburgh', salary: '$324,050' },
    { name: 'Unity Butler', title: 'Marketing Designer', location: 'San Francisco', salary: '$85,675' }
];

@Component({
    selector: 'dng2-dt',
    template: require('./datatables.component.html')
})
export class DataTablesComponent implements AfterViewInit {
    @ViewChild('dtElemDynamic') elDynamic: ElementRef;
    @ViewChild('dtElemStatic') elStatic: ElementRef;

    protected staticData: Array<any> = tableData;
    protected staticDataOrder: Array<string> = tableDataOrder;

    ngAfterViewInit() {

        // Create DataTables from static HTML (Angular first creates table HTML that includes all rows and columns)
        $(this.elStatic.nativeElement).DataTable({
            columns: [
                {
                    title: 'Name',
                },
                {
                    title: 'Position',
                },
                {
                    title: 'Office',
                },
                {
                    title: 'Salary',
                }
            ]
        });

        // Create DataTables from dynamic HTML (DataTables created all HTML inside <table> tag)
        const options: any = {
            columns: [
                {
                    title: 'Name',
                    data: 'name'
                },
                {
                    title: 'Position',
                    data: 'title'
                },
                {
                    title: 'Location',
                    data: 'location'
                },
                {
                    title: 'Salary',
                    data: 'name'
                }
            ],
            data: tableData
        };
        $(this.elDynamic.nativeElement).DataTable(options);
    }

    protected createColumnHTML(data: any, key: string): string {
        return data[key];
    }
}
