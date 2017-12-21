import { Component, ComponentFactoryResolver, Injector } from '@angular/core';

import { AlertService } from '../../services';
import { getComponentHtml } from '../../widgets';
import { Planets } from './planets-data';
import { Species } from './species-data';
import { RouteManager } from '../../router';
import { PersonnelData } from './personnel-data';


export interface Route {
    link: Array<any>;
    text: string;
}

@Component({
  selector: 'dng-route',
  template: '<a *ngFor="let route of routes" routerLinkActive="router-link-active" [routerLink]="route.link">{{ route.text }}</a>'
})
export class RouteComponent {
  protected routes: Array<Route> = [];

  setDynamicData(data: Array<Route>): void {
    data.forEach(item => {
      this.routes.push(item);
    });
  }
}

@Component({
  selector: 'dng-demo',
  template: require('./demo.component.html')
})
export class DemoComponent {

  protected renderPlanetsFn: Function;
  protected renderSpeciesFn: Function;

  personnel = PersonnelData;

  species = Species;

  planets = Planets;

  tableOptions = {
    order: ['name', 'title', 'salary', 'location']
  };

  constructor(private alertService: AlertService, private resolver: ComponentFactoryResolver,
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
