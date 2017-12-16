import { AppObserver } from '../../widgets/base';


export const ProgressStates = {
    NULL: null,
    SUBMITTED: 'submitted',
    SUCCESS: 'success',
    ERROR: 'error'
};

export interface ProgressTracker {
    state: string;
}

export class StateTrackerObservable extends AppObserver<ProgressTracker> {

    setState(state: string): void {
        this.setSubject({state});
    }
}
