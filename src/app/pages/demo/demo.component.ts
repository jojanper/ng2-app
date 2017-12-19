import { Component, ComponentFactoryResolver, Injector,/*, ChangeDetectorRef /*, ViewContainerRef,*/ Type } from '@angular/core';

import { AlertService } from '../../services';
// import { SpinnerComponent } from '../../widgets';
import { Species } from './planets-data';
import { RouteManager } from '../../router';


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

export interface Route {
    link: Array<any>,
    text: string
}

@Component({
  selector: 'dng-route',
  template: '<a *ngFor="let route of routes" routerLinkActive="router-link-active" [routerLink]="route.link">{{ route.text }}</a>'
  // template: '<a routerLinkActive="router-link-active" [routerLink]="[\'/species\', 1]">{{ html }}</a>'
})
export class RouteComponent {
  //protected html = '';
  protected routes: Array<Route> = [];

  /*
  constructor(private resolver: ComponentFactoryResolver, private injector: Injector,
    private viewContainerRef: ViewContainerRef) { }
    */

    /*
  getHTML(component: Type<any>): string {
    const factory = this.resolver.resolveComponentFactory(component);
    this.viewContainerRef.createComponent(factory);
  }
  */

  constructor(/*private ref: ChangeDetectorRef*/) {
    //this.routes = [];
  }

  setDynamicData(data: Route): void {
    //console.log(html);
    //console.log(this);
    //console.log(this.ref);
    //this.html = html;
    this.routes.push(data);
    /*
      text: data.text,
      link: ['/species', data.id]
    });
    */
    //this.ref.detectChanges();

    //return '';
  }
}

function createComponent(resolver: ComponentFactoryResolver, injector: Injector, component: Type<any>,
  data: any): string {
  const factory = resolver.resolveComponentFactory(component);
  const componentRef = factory.create(injector);

  const obj = componentRef.instance;
  obj.setDynamicData(data);
  componentRef.changeDetectorRef.detectChanges();

  return componentRef.location.nativeElement.innerHTML;
}


@Component({
  selector: 'dng-demo',
  template: require('./demo.component.html')
})
export class DemoComponent {

  protected renderFn: Function;

  data = tableData;

  data2 = Species;

  tableOptions = {
    order: ['name', 'title', 'salary', 'location']
  };

  constructor(private alertService: AlertService, private resolver: ComponentFactoryResolver,
    private injector: Injector) {
      // console.log(this.resolver);
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
    /*
    console.log(data);
    // console.log(this);
    const factory = this.resolver.resolveComponentFactory(SpinnerComponent);
    const component = factory.create(this.injector);
    const spinner: SpinnerComponent = <SpinnerComponent>component.instance;
    spinner.type = 'spinner-2';
    spinner.scale = '0.25';
    //console.log(component);
    component.changeDetectorRef.detectChanges();
    */

    //const dynObj = new DynamicHTMLComponent();
    //dynObj.setHTML('HTML');
    /*
    const factory = this.resolver.resolveComponentFactory(RouteComponent);
    const component = factory.create(this.injector);
    //const obj: RouteComponent = <RouteComponent>component2.instance;
    const obj = component.instance;

    //const html = `<a routerLinkActive="router-link-active" [routerLink]="['/species', 1]">Link</a>`
    obj.setDynamicData({link: ['/species', data.row.id], text: data.row[data.target]});
    component.changeDetectorRef.detectChanges();

    console.log(component.location.nativeElement);

    return component.location.nativeElement.innerHTML; // component.location.nativeElement.innerHTML;
    */
    //console.log(RouteManager.resolveByName('species-view'));
    const dynData = {link: [RouteManager.resolveByName('species-view'), data.row.id], text: data.row[data.target]};
    return createComponent(this.resolver, this.injector, RouteComponent, dynData);
  }
}
