import { Component /*, ComponentFactoryResolver, Injector, OnInit*/, OnDestroy,
    /*ViewContainerRef*/ } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { StarWarsApiService } from '../../services';
import { AutoUnsubscribe } from '../../utils';
//import { SpinnerComponent } from '../../widgets';


@Component({
  selector: 'dng-species-detail',
  templateUrl: './species-detail.component.html',
})
@AutoUnsubscribe(['unsubscribe'])
export class SpeciesDetailComponent implements /*OnInit,*/ OnDestroy {
    data: any;
    done = false;

    private unsubscribe: Subject<void> = new Subject();

    constructor(private api: StarWarsApiService, private route: ActivatedRoute/*,
        private resolver: ComponentFactoryResolver, private injector: Injector,
    private viewContainerRef: ViewContainerRef*/) {

        const observable = this.api.getSpeciesDetail(this.route.snapshot.params.id);
        observable.pipe(takeUntil(this.unsubscribe)).subscribe(response => {
            this.data = response;
            this.done = true;
        });
    }

    /*
    ngOnInit() {
        const factory = this.resolver.resolveComponentFactory(SpinnerComponent);
        const component = factory.create(this.injector);
        console.log(component);
        component.changeDetectorRef.detectChanges();
        console.log(component.location.nativeElement.innerHTML);

        this.viewContainerRef.createComponent(factory);
    }
    */

    ngOnDestroy() {}
}
