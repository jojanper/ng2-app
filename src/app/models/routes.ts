const authRoutes = {
    register: {
        name: 'register'
    },
    login: {
        name: 'login'
    },
    logout: {
        name: 'logout'
    }
};

const appRoutes = {
    home: {
        name: 'home'
    },
    about: {
        name: 'about'
    },
    demo: {
        name: 'test'
    },
    auth: {
        name: 'auth',
        children: authRoutes
    },
    default: {
        name: 'home'
    }
};

export class RouteManager {

    static get ROUTES(): any {
        return appRoutes;
    }
}
