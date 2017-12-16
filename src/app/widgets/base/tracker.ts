import { AppObservableObject } from '../../widgets/base';


export const ProgressStates = {
    NULL: null,
    SUBMITTED: 'submitted',
    SUCCESS: 'success',
    ERROR: 'error'
};

export interface ProgressTracker {
    state: string;
}

export class StateTrackerObservable extends AppObservableObject<ProgressTracker> {

    setState(state: string): void {
        this.setObject({state});
    }
}
