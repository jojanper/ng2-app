import { StateTrackerObservable, ProgressStates } from './tracker';


describe('StateTrackerObservable', () => {
    const stateTracker = new StateTrackerObservable();

    const verify = (mode: string, newState: string): void => {
        let state = null;
        stateTracker.observable.subscribe(_state => {
            state = _state;
        });

        stateTracker[`set${mode}`](newState);
        expect(state).toEqual({state: newState});
    };

    it('state is set to submitted', () => {
        verify('Progress', ProgressStates.SUBMITTED);
    });

    it('state is set to error', () => {
        verify('Error', ProgressStates.ERROR);
        verify('Success', ProgressStates.SUCCESS);
    });
});
