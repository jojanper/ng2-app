import { Component, OnInit, ComponentFactoryResolver, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { RouterService } from '../../../services';
import { StarWarsApiService, AppPlanet } from './services';
import { getComponentHtml, RouteComponent } from '../../../widgets';


@Component({
    selector: 'dng-planet',
    templateUrl: './planets.component.html',
})
export class PlanetsComponent implements OnInit {
    protected renderPlanetsFn: Function;
    observable: Observable<Array<AppPlanet>>;

    constructor(
        private api: StarWarsApiService,
        private resolver: ComponentFactoryResolver,
        private injector: Injector,
        private routerService: RouterService
    ) {}

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
                link: [this.routerService.resolveByName('starwars.species-view'), item.id],
                text: item.name
            };
        });

        return getComponentHtml(this.resolver, this.injector, RouteComponent, dynData);
    }
}
