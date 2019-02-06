import { Component, Input } from '@angular/core';
import { Observable,  Subscription } from 'rxjs';

import { ProgressStates, ProgressTracker, StateTrackerObservable } from './tracker';


/**
 * Abstract base component for tracking component state. Useful, for example,
 * when spinner need to be rendered for a component that is processing some
 * (perhaps long-running) action.
 */
export abstract class AppBaseTrackerComponent {
    private state: string;
    protected stateSubscription: Subscription;
    @Input() stateTracker: StateTrackerObservable;

    protected initStateChangesTracker(): void {
        if (this.stateTracker) {
            this.trackStateChanges(this.stateTracker.observable);
        }
    }

    protected untrackStateChanges(): void {
        if (this.stateSubscription) {
            this.stateSubscription.unsubscribe();
        }
    }

    protected setProcessingState(): void {
        if (this.stateTracker) {
            this.stateTracker.setProgress();
        }
    }

    private trackStateChanges(observable: Observable<ProgressTracker>): void {
        this.stateSubscription = observable.subscribe((progressTracker) => {
            this.state = progressTracker.state;
        });
    }

    get inProgress(): boolean {
        return (this.state && this.state === ProgressStates.SUBMITTED) ? true : false;
    }
}


@Component({
    selector: 'dng-base',
    template: '<router-outlet></router-outlet>'
})
export class AppEmptyViewComponent {}
