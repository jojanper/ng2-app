import { AppObservableObject } from './base.observable';


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
    setSuccess(): void {
        this.setObject({state: ProgressStates.SUCCESS});
    }

    setProgress(): void {
        this.setObject({state: ProgressStates.SUBMITTED});
    }

    setError(): void {
        this.setObject({state: ProgressStates.ERROR});
    }
}
