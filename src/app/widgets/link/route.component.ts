import { Component } from '@angular/core';


export interface RouteComponentData {
    link: Array<any>;
    text: string;
}

@Component({
    selector: 'dng-route',
    template: '<a *ngFor="let route of routes" routerLinkActive="router-link-active" [routerLink]="route.link">{{ route.text }}</a>'
})
export class RouteComponent {
    routes: Array<RouteComponentData> = [];

    setDynamicData(data: Array<RouteComponentData>): void {
        data.forEach(item => {
            this.routes.push(item);
        });
    }
}
