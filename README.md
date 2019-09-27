[![build][travis-image]][travis-url]
[![codecov.io][codecov-image]][codecov-url]
[![Dependency Status][david-image]][david-url]
[![devDependency Status][david-dev-image]][david-dev-url]

[travis-image]: https://travis-ci.org/jojanper/angular-app.svg?branch=master
[travis-url]: https://travis-ci.org/jojanper/angular-app
[codecov-image]: https://codecov.io/gh/jojanper/angular-app/coverage.svg?branch=master
[codecov-url]: https://codecov.io/gh/jojanper/angular-app?branch=master
[david-image]: https://david-dm.org/jojanper/angular-app.svg
[david-url]: https://david-dm.org/jojanper/angular-app
[david-dev-image]: https://david-dm.org/jojanper/angular-app/dev-status.svg
[david-dev-url]: https://david-dm.org/jojanper/angular-app#info=devDependencies

# angular-app

> [Angular](https://angular.io/) playground for application development. Initial project setup based on https://github.com/preboot/angular-webpack. Project has been later [converted](https://github.com/jojanper/angular-app/pull/63) to use Angular CLI. The project focuses mainly on creating core/enabler components to be used in a Angular app rather than the app itself.

Demo available [here](https://jojanper.github.io/angular-app/)

## Quickstart

### Install dependencies
```
npm install
```

### Start (development) server
```
npm start
```
Open http://localhost:4200 in your browser. The `Components` menu does not require authentication. Views that require authentication need proper backend server.

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
The application uses lazy loading for [multiple sub-views](https://github.com/jojanper/angular-app/blob/master/src/app/pages/pages.routing.ts)
at the moment. some of the application views are bundled into separate chunks that are eagerly loaded at start up.

To quickly test the build files:
```
npm run serve-build
```
The application is now available in [http://localhost:4200](http://localhost:4200).

### Backend support
Current version runs with webpack-dev-server and client requires only static assets. Backend upgrade is needed if HTTP requests are made from client.
There is Node.js + Express backend skeleton available in https://github.com/jojanper/draal-jsapp that uses this repo as frontend client.


## Publish to GitHub Pages

``` bash
npm run gh-pages
```


## Travis CI
https://travis-ci.org/jojanper/angular-app


## Project layout within `src` folder

* app
    * Source files for the application
* assets
    * Asset files for the application (images etc.)
* style
    * Application wide styling
* test_helpers
    * Utility classes for unit testing

The structure of source files tries to follow the principles outlined in
https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1 (target framework is React but applicable to Angular project also).

* application
    * Bootstrap module for the application - [AppModule](https://github.com/jojanper/angular-app/blob/master/src/app/application/app.module.ts)
* models
    * Models and interfaces that are application wide
* pages
    * Application pages and related views
* router
    * Application routes and related business logic
* rx
    * Reactive extensions using @ngrx/store and @ngrx/effects that are application wide
* services
    * Application services
* utils
    * Utility classes and methods. Application wide decorators are also stored here.
* widgets
    * Generic components for building the views across pages

### Application building blocks (non-exhaustive list)

- [Components](https://github.com/jojanper/angular-app/tree/master/src/app/widgets)
    - [Login](https://github.com/jojanper/angular-app/blob/master/src/app/pages/auth/login/login.component.ts)
    - [Logout](https://github.com/jojanper/angular-app/blob/master/src/app/pages/auth/logout/logout.component.ts)
    - [Alert](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/alert/alert.component.ts)
    - [Form](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/form/form.component.ts)
      + [FormModel](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/form/form.model.ts)
      + [Usage example](https://github.com/jojanper/angular-app/blob/master/src/app/pages/demo/form/demo-form.component.ts)
    - [DataTables](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/datatables/datatables.component.ts)
      + [Usage example](https://github.com/jojanper/angular-app/blob/master/src/app/pages/demo/demo.component.ts)
- [Services](https://github.com/jojanper/angular-app/tree/master/src/app/services)
    - [Alert](https://github.com/jojanper/angular-app/blob/master/src/app/services/alert/alert.service.ts)
    - [Application events](https://github.com/jojanper/angular-app/blob/master/src/app/services/events/appevent.service.ts)
    - [ApiService](https://github.com/jojanper/angular-app/blob/master/src/app/services/api/api.service.ts)
    - [AuthGuard](https://github.com/jojanper/angular-app/blob/master/src/app/services/auth/auth.guard.ts)
- [Router setup](https://github.com/jojanper/angular-app/tree/master/src/app/router)
- [State management, actions, effects](https://github.com/jojanper/angular-app/tree/master/src/app/rx)
- [Application views](https://github.com/jojanper/angular-app/tree/master/src/app/pages)
- [Application entry point](https://github.com/jojanper/angular-app/tree/master/src/app/application)

## License

[MIT](/LICENSE)
