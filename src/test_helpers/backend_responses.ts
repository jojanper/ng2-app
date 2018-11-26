import { User } from '../app/rx/auth';

const rootApi = {
    data: [
        {
            url: '/api/auth/v1/signup',
            method: 'post',
            info: 'User sign-up',
            authenticate: false,
            name: 'signup',
            version: 1
        },
        {
            url: '/api/auth/account-activation/:activationkey',
            method: 'post',
            info: 'Account activation',
            authenticate: false,
            name: 'account-activation'
        },
        {
            url: '/api/auth/login',
            method: 'post',
            info: 'User login',
            authenticate: false,
            name: 'login'
        },
        {
            url: '/api/auth/logout',
            method: 'post',
            info: 'User logout',
            authenticate: false,
            name: 'logout'
        },
        {
            url: '/api/auth/v1/password-reset-request',
            method: 'post',
            info: 'User password reset request',
            authenticate: false,
            name: 'password-reset-request'
        }
    ]
};

export const ResponseFixtures = {
    root: rootApi,
    auth: {
        signup: rootApi.data[0],
        activate: rootApi.data[1],
        login: rootApi.data[2],
        logout: rootApi.data[3],
        pwResetRequest: rootApi.data[4]
    }
};

export class AuthResponseFixture {
    url: string;
    responses = {};

    constructor(public rootUrl: string, mode: string, response: any = {}) {
        this.url = ResponseFixtures.auth[mode].url;

        this.responses[this.rootUrl] = ResponseFixtures.root;
        this.responses[this.url] = {data: response};
    }

    get rootResponse(): any {
        return this.responses[this.rootUrl];
    }

    get urlResponse(): any {
        return this.responses[this.url];
    }

    static User(): User {
        return {
            email: 'test@test.com',
            expires: 123456,
            validAt: Date.now()
        };
    }
}
