import { reducer } from './auth.reducers';
import * as auth from './auth.actions';
import { User } from './models';


describe('AuthReducer', () => {
    it('should return the default state for logout action', () => {
        const state = {} as any;

        const result = reducer(state, new auth.LogoutSuccessAction('login-view'));

        expect(result.authenticated).toBeFalsy();
    });

    it('should return the authenticated state for login success action', () => {
        const state = {} as any;
        const user = {
            email: 'test@test.com',
            expires: 123456,
            validAt: Date.now()
        } as User;

        const result = reducer(state, new auth.LoginSuccessAction(user));

        expect(result.authenticated).toBeTruthy();
    });

    it('should return unmodified state for unknown action', () => {
        const state = {foo: 'bar'} as any;

        const result = reducer(state, {type: 'foo'});

        expect(result).toEqual(state);
    });
});
