import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';

import { AppEmptyViewComponent } from '../../../utils/base';

import { TerminalComponent } from './terminal.component';
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
        CommonModule
    ],
    declarations: [
        TerminalComponent
    ],
    providers: [
    ]
})
export class TerminalModule {}
