import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppEmptyViewComponent } from '../../../../utils/base';
import { DraalWidgetsCoreModule } from '../../../../widgets';

import { TimelineComponent, TimelineEntryComponent, AudioEventsComponent,
    MediaPlayerComponent } from './components';
import { AUDIOROUTES } from './audio.routes.config';


const CHILDROUTES: Route[] = [
    {
        component: MediaPlayerComponent,
        path: AUDIOROUTES.children[0].url,
        data: {
            config: {
                route: AUDIOROUTES.children[0]
            }
        }
    },
    {
        component: AudioEventsComponent,
        path: AUDIOROUTES.children[1].url,
        data: {
            config: {
                route: AUDIOROUTES.children[1]
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
        NgbModule,
        DraalWidgetsCoreModule
    ],
    declarations: [
        TimelineComponent,
        TimelineEntryComponent,
        AudioEventsComponent,
        MediaPlayerComponent
    ],
    providers: [
    ]
})
export class AudioModule {}
