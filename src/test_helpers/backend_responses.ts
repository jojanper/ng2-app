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
    root: rootApi
};
