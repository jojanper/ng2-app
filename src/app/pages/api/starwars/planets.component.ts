import { Component, OnInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { RouteManager } from '../../../router';
import { StarWarsApiService, AppPlanet } from './services';
import { getComponentHtml, RouteComponent } from '../../../widgets';


@Component({
    selector: 'dng-planet',
    templateUrl: './planets.component.html',
})
export class PlanetsComponent implements OnInit {

    protected renderPlanetsFn: Function;
    protected observable: Observable<Array<AppPlanet>>;

    constructor(private api: StarWarsApiService,
        private resolver: ComponentFactoryResolver,
        private injector: Injector) {}

    ngOnInit() {
        this.renderPlanetsFn = this.renderPlanets.bind(this);
        this.observable = this.api.getData();
    }

    renderPlanets(data: any): string {
        // Call column specific rendering implementation
        return this[`${data.target}Render`](data.row);
    }

    protected speciesRender(data: any): string {
        const dynData = data.species.map(item => {
            return {
                link: [RouteManager.resolveByName('species-view'), item.id],
                text: item.name
            };
        });

        return getComponentHtml(this.resolver, this.injector, RouteComponent, dynData);
    }
}
