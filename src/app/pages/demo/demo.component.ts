import { Component, ComponentFactoryResolver, Injector } from '@angular/core';

import { AlertService } from '../../services';
import { getComponentHtml, RouteComponent } from '../../widgets';
import { Planets } from './tables/planets-data';
import { Species } from './tables/species-data';
import { RouteManager } from '../../router';
import { PersonnelData } from './tables/personnel-data';


@Component({
    selector: 'dng-demo',
    template: require('./demo.component.html')
})
export class DemoComponent {

    species = Species;
    planets = Planets;
    personnel = PersonnelData;

    protected renderPlanetsFn: Function;
    protected renderSpeciesFn: Function;

    tableOptions = {
    };

    constructor(private alertService: AlertService,
        private resolver: ComponentFactoryResolver,
        private injector: Injector) {

        this.renderPlanetsFn = this.renderPlanets.bind(this);
        this.renderSpeciesFn = this.renderSpecies.bind(this);
    }

    addSuccessAlert() {
        this.alertService.success('Success');
    }

    addInfoAlert() {
        this.alertService.info('Info');
    }

    addWarningAlert() {
        this.alertService.warning('Warning');
    }

    addErrorAlert() {
        this.alertService.error('Error');
    }

    renderSpecies(data: any): string {
      return `<a href="${data.row.url}">${data.row[data.target]}</a>`;
    }

    renderPlanets(data: any): string {
        const dynData = data.row.species.map(item => {
            return {
                link: [RouteManager.resolveByName('species-view'), item.id],
                text: item.name
            };
        });

        return getComponentHtml(this.resolver, this.injector, RouteComponent, dynData);
    }
}
