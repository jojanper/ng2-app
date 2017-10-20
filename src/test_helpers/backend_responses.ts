const rootApi = {
    data: [
        {
            url: '/api/auth/v1/signup',
            method: 'post',
            info: 'User sign-up',
            authenticate: false,
            name: 'signup',
            version: 1
        }
    ]
};

export const ResponseFixtures = {
    root: rootApi
};
