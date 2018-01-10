import { Component, ComponentFactoryResolver, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { RouteComponent } from './route.component';
import { getComponentHtml } from '../../widgets';


@Component({
    selector: 'dng-test-route-component',
    template: ''
})
export class RouteTestComponent {

    constructor(private resolver: ComponentFactoryResolver,
        private injector: Injector) {}

    getRouteHTML() {
        const dynData = [{link: ['/']}];
        return getComponentHtml(this.resolver, this.injector, RouteComponent, dynData);
    }
}


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot([{
            path: '', component: RouteTestComponent
        }])
    ],
    declarations: [
        RouteTestComponent,
        RouteComponent
    ],
    entryComponents: [
        RouteComponent
    ]
})
class RouteComponentTestModule {}

const targetHtml = 'ng-reflect-router-link-active="router-link-active" href="/"></a>';

describe('Route Component', () => {
    let fixture: ComponentFixture<RouteTestComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouteComponentTestModule],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'}
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(RouteTestComponent);
            fixture.detectChanges();
        });
    }));

    it('HTML can be dynamically created', done => {
        fixture.whenStable().then(() => {
            const html = fixture.componentInstance.getRouteHTML();
            expect(html.endsWith(targetHtml)).toBeTruthy();
            done();
        });
    });
});
