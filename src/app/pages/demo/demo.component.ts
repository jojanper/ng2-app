import { Component, ComponentFactoryResolver, Injector } from '@angular/core';

import { AlertService } from '../../services';
import { getComponentHtml } from '../../widgets';
import { Species } from './planets-data';
import { RouteManager } from '../../router';
import { PersonnelData } from './personnel-data';


export interface Route {
    link: Array<any>,
    text: string
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

  protected renderFn: Function;

  data = PersonnelData;

  data2 = Species;

  tableOptions = {
    order: ['name', 'title', 'salary', 'location']
  };

  constructor(private alertService: AlertService, private resolver: ComponentFactoryResolver,
    private injector: Injector) {
      this.renderFn = this.render.bind(this);
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

  render(data: any): string {
    const dynData = {link: [RouteManager.resolveByName('species-view'), data.row.id], text: data.row[data.target]};
    return getComponentHtml(this.resolver, this.injector, RouteComponent, [dynData]);
  }
}
