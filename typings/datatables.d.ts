/**
 * Created by Bine Gorjanc
 * gorjanc@gmail.com
 * 
 */
interface JQuery {
    DataTable(param?: DataTablesNew.Options): DataTablesNew.DataTableApi
    DataTable(): DataTablesNew.DataTableApi;
}

declare module DataTablesNew {
    export interface DataTableApi {
        order(): any[][];
        order(order: any[]): DataTableApi;
        order(order: any[][]): DataTableApi;

        page: PageApiInterface;
        row: SingleRowInterface;
        rows: MultipleRowsInterface;
        cell: SingleCellInterface;
        cells: MultipleCellsInterface;

        data(): Array<any>;

        draw(): DataTableApi;
        draw(reset: boolean): DataTableApi;

        clear();

        settings(): Options;

        destroy(): DataTableApi;
        destroy(remove: boolean): DataTableApi;
    }

    export interface Options {
        rowCallback?: (row: Element, data: any) => void;
        createdRow?: (row: Element, data: any, dataIndex: number) => void;
        //drawCallback?: (settings: Options) => void;

        serverSide?: boolean;
        paging?: boolean;
        info?: boolean;
        searching?: boolean;
        lengthChange?: boolean;
        columns?: Array<ColumnOptions>;
        ajax?: any;
        data?: any;
    }

    interface ColumnOptions {
        searchable?: boolean;
        visible?: boolean;
        title?: string;
        orderable?: boolean;
        className?: string;
        render?: any;
        type?: string;
    }

    interface TableDataApi extends DataTableApi {
        cache(type: string): any;
        data(): any;
        data(d: any): MultipleRowsApi;
        index(): number;
        indexes(): Array<number>;
    }

    export interface RowsApi extends TableDataApi {
        invalidate(source?: string): RowsApi;
        remove(): DataTableApi;
    }

    export interface MultipleCellsInterface {
        (): MultipleCellsApi;
    }

    export interface MultipleCellsApi extends RowsApi {
    }

    export interface SingleCellApi extends RowsApi {
    }

    export interface SingleCellInterface {
        (): SingleCellApi;
    }

    export interface MultipleRowsInterface {
        (): MultipleRowsApi;
        (rowSelector, modifier?): MultipleRowsApi;
        add(data: Array<any>);
    }

    export interface MultipleRowsApi extends RowsApi {
        nodes(): Array<Element>;
    }

    export interface SingleRowInterface {
        (): SingleRowApi;
        (rowSelector, modifier?): SingleRowApi;
        add(data: any): any;
    }

    export interface SingleRowApi extends RowsApi {
        node(): Element;
    }

    export interface PageInterface {
        page: number;
        pages: number;
        start: number;
        end: number;
        length: number;
        recordsTotal: number;
        recordsDisplay: number;
    }

    export interface PageApiInterface {
        info(): PageInterface;
    }
}