import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { StarWarsApiService } from '../../services';
import { AutoUnsubscribe } from '../../utils';


@Component({
  selector: 'dng-species-detail',
  templateUrl: './species-detail.component.html',
})
@AutoUnsubscribe(['unsubscribe'])
export class SpeciesDetailComponent implements OnDestroy {
    data: any;
    done = false;

    private unsubscribe: Subject<void> = new Subject();

    constructor(private api: StarWarsApiService, private route: ActivatedRoute) {
        const observable = this.api.getSpeciesDetail(this.route.snapshot.params.id);
        observable.pipe(takeUntil(this.unsubscribe)).subscribe(response => {
            this.data = response;
            this.done = true;
        });
    }

    ngOnDestroy() {}
}
