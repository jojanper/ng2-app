import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppEmptyViewComponent } from '../../../../utils/base';

import { TerminalComponent } from './terminal.component';
import { TimelineComponent, TimelineEntryComponent } from './timeline.component';
import { TERMINALROUTES } from './terminal.routes.config';


const CHILDROUTES: Route[] = [
    {
        component: TerminalComponent,
        path: TERMINALROUTES.children[0].url,
        data: {
            config: {
                route: TERMINALROUTES.children[0]
            }
        }
    }
];

export const TERMINALROUTE: Route = {
    path: TERMINALROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: {
            route: TERMINALROUTES
        }
    },
    children: CHILDROUTES
};


@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    declarations: [
        TerminalComponent,
        TimelineComponent,
        TimelineEntryComponent
    ],
    providers: [
    ]
})
export class TerminalModule {}
