import * as auth from './auth.actions';
import { User } from './models';


export interface State {
    authenticated: boolean;
    user: User | null;
}

export const initialState: State = {
    authenticated: false,
    user: null,
};

export function reducer(state = initialState, action: auth.Actions): State {
    switch (action.type) {
        case auth.ActionTypes.LOGIN_SUCCESS: {
            return {
                ...state,
                authenticated: true,
                user: action['payload']
            };
        }

        case auth.ActionTypes.LOGOUT_SUCCESS: {
            return initialState;
        }

        default: {
            return state;
        }
    }
}

export const getAuthStatus = (state: State) => state.authenticated;
