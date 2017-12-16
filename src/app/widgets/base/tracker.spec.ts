import { StateTrackerObservable, ProgressStates } from './tracker';


describe('StateTrackerObservable', () => {
    let stateTracker = new StateTrackerObservable();

    const verify = (newState: string): void => {
        let state = null;
        stateTracker.observable.subscribe(_state => {
            state = _state;
        });

        stateTracker.setState(newState);
        expect(state).toEqual({state: newState});
    }

    it('state is set to submitted', () => {
        verify(ProgressStates.SUBMITTED);
        verify(ProgressStates.NULL);
    });

    it('state is set to error', () => {
        verify(ProgressStates.ERROR);
        verify(ProgressStates.SUCCESS);
    });
});
