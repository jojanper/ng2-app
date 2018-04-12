import { AppBaseTrackerComponent } from './base.component';
import { ProgressStates, StateTrackerObservable } from './tracker';


class AppBaseTrackerTestComponent extends AppBaseTrackerComponent {
    start() {
        this.initStateChangesTracker();
    }

    clear() {
        this.untrackStateChanges();
    }

    processing() {
        this.setProcessingState();
    }
}

describe('AppBaseTrackerComponent', () => {
    const stateTracker = new StateTrackerObservable();

    const component = new AppBaseTrackerTestComponent();
    component.stateTracker = stateTracker;

    afterEach(() => {
        component.clear();
    });

    it('processing state is changed', () => {
        // Component state is set to processing state
        component.start();
        component.processing();
        expect(component.inProgress).toBeTruthy();

        // Processing state completes
        stateTracker.setState(ProgressStates.SUCCESS);
        expect(component.inProgress).toBeFalsy();
    });
});
