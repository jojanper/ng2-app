import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';


export abstract class AppDataSource<T> extends DataSource<T> {
    private pageSize;
    private cachedData: Array<T>;
    private fetchedPages = new Set<number>();
    private dataStream = new BehaviorSubject<T[]>([]);
    private subscription = new Subscription();

    constructor() {
        super();
    }

    connect(collectionViewer: CollectionViewer): Observable<T[]> {
        // Load the initial data that will start the virtual scrolling
        this.getData(1, true);

        // Subcscribe to new data requests
        this.subscription.add(collectionViewer.viewChange.subscribe(range => {
            const startPage = this.getPageForIndex(range.start);
            const endPage = this.getPageForIndex(range.end - 1);
            for (let i = startPage; i <= endPage; i++) {
                this.fetchPage(i);
            }
        }));

        return this.dataStream;
    }

    disconnect(): void {
        this.subscription.unsubscribe();
    }

    private getPageForIndex(index: number): number {
        return Math.floor(index / this.pageSize);
    }

    private fetchPage(page: number) {
        if (this.fetchedPages.has(page)) {
            return;
        }

        this.getData(page + 1, false);
    }

    protected setInitialData(pageSize: number, dataCount: number) {
        this.fetchedPages.add(0);
        this.pageSize = pageSize;
        this.cachedData = Array.from<T>({length: dataCount});
    }

    protected setData(data: Array<any>, page: number): void {
        const start = page * this.pageSize;
        this.cachedData.splice(start, data.length, ...data);
        this.dataStream.next(this.cachedData);
    }

    abstract getData(page: number, initialize: boolean): void;
}
