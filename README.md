[![build][travis-image]][travis-url]
[![codecov.io][codecov-image]][codecov-url]

[travis-image]: https://travis-ci.org/jojanper/angular-app.svg?branch=master
[travis-url]: https://travis-ci.org/jojanper/angular-app
[codecov-image]: https://codecov.io/gh/jojanper/angular-app/coverage.svg?branch=master
[codecov-url]: https://codecov.io/gh/jojanper/angular-app?branch=master

# angular-app

> [Angular](https://angular.io/) playground for application development. Initial project setup based on https://github.com/preboot/angular-webpack.

## Quickstart

### Install dependencies
```
npm install
```

### Start (development) server
```
npm start
```
Open http://localhost:3002 in your browser. Use whatever username and password to sign-in.

### Run unit tests
```
npm test
```

### Run e2e tests
```
npm run e2e
```

### Build production files (into `dist` directory)
```
npm build
```
The application uses lazy loading for [2 sub-views](https://github.com/jojanper/angular-app/blob/master/src/app/pages/pages.routing.ts)
at the moment. Demo and authentication related views are bundled into separate chunks that are eagerly loaded at start up.

### Backend support
Current version runs with webpack-dev-server and client requires only static assets. Backend upgrade is needed if HTTP requests are made from client.
There is Node.js + Express backend skeleton available in https://github.com/jojanper/draal-jsapp that uses this repo as frontend client.


## Travis CI
https://travis-ci.org/jojanper/angular-app


## Project layout within `src` folder

* app
    * Source files for the application
* public
    * Asset files for the application (HTML entry, CSS, media files, etc)
    * Used by webpack development server with live reloading. This should be used for development only
* style
    * Application wide styling
* test_helpers
    * Utility classes for unit testing

The structure of source files tries to follow the principles outlined in
https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1 (target framework is React but applicable to Angular project also).

* application
    * Bootstrap module for the application - [AppModule](https://github.com/jojanper/angular-app/blob/master/src/app/application/app.module.ts)
* pages
    * Application pages and related views
* router
    * Application routes and related business logic
* rx
    * Reactive extensions using @ngrx/store and @ngrx/effects that are application wide
* services
    * Application services
* widgets
    * Generic components for building the views across pages

### Application building blocks (non-exhaustive list)

- [Components](https://github.com/jojanper/angular-app/tree/master/src/app/widgets)
    - [Login](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/auth/login/login.component.ts)
      + [AuthGuard](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/auth/auth.guard.ts)
    - [Logout](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/auth/login/logout.component.ts)
    - [Alert](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/alert/alert.component.ts)
    - [Form](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/form/form.component.ts)
      + [FormModel](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/form/form.model.ts)
      + [example](https://github.com/jojanper/angular-app/blob/master/src/app/pages/form/demo-form.component.ts)
    - [DataTables](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/datatables/datatables.component.ts)
      + [example](https://github.com/jojanper/angular-app/blob/master/src/app/pages/demo/demo.component.ts)
- [Services](https://github.com/jojanper/angular-app/tree/master/src/app/services)
    - [Alert](https://github.com/jojanper/angular-app/blob/master/src/app/services/alert/alert.service.ts)
    - [Application events](https://github.com/jojanper/angular-app/blob/master/src/app/services/events/appevent.service.ts)
    - [ApiService](https://github.com/jojanper/angular-app/blob/master/src/app/services/api/api.service.ts)

## License

[MIT](/LICENSE)
