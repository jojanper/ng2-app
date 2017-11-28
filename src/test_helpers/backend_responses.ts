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
            name: 'account-activation',
            version: 1
        }
    ]
};

export const ResponseFixtures = {
    root: rootApi
};
