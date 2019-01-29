import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppEmptyViewComponent } from '../../../../utils/base';

import { TimelineComponent, TimelineEntryComponent, AudioEventsComponent } from './components';
import { AUDIOROUTES } from './audio.routes.config';


const CHILDROUTES: Route[] = [
    {
        component: AudioEventsComponent,
        path: AUDIOROUTES.children[0].url,
        data: {
            config: {
                route: AUDIOROUTES.children[0]
            }
        }
    }
];

export const AUDIOROUTE: Route = {
    path: AUDIOROUTES.url,
    component: AppEmptyViewComponent,
    data: {
        config: {
            route: AUDIOROUTES
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
        TimelineComponent,
        TimelineEntryComponent,
        AudioEventsComponent
    ],
    providers: [
    ]
})
export class AudioModule {}
