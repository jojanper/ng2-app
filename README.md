[![Build Status](https://travis-ci.org/jojanper/angular-app.svg?branch=master)](https://travis-ci.org/jojanper/angular-app)

# angular-app

> [Angular](https://angular.io/) playground for application development. Project setup based on https://github.com/preboot/angular-webpack.

## Quickstart

### Install dependencies
```
npm install
```

### Start server
```
npm start
```
Open http://localhost:3002 in your browser. Use whatever username and password to sign-in.

### Run unit tests
```
npm test
```

### Backend support
Current version runs with webpack-dev-server and client requires only static assets. Backend upgrade is needed if HTTP requests are made from client.
There is Node.js + Express backend skeleton available in https://github.com/jojanper/draal-jsapp that uses this repo as frontend client.


## Travis CI
https://travis-ci.org/jojanper/angular-app


## Application building blocks (non-exhaustive list)

- Components
    - [Login](https://github.com/jojanper/angular-app/blob/master/src/app/auth/login/login.component.ts)
      + [AuthGuard](https://github.com/jojanper/angular-app/blob/master/src/app/auth/auth.guard.ts)
    - [Logout](https://github.com/jojanper/angular-app/blob/master/src/app/auth/login/logout.component.ts)
    - [Alert](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/alert/alert.component.ts)
    - [Form](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/form/form.component.ts)
      + [FormModel](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/form/form.model.ts)
      + [example](https://github.com/jojanper/angular-app/blob/master/src/app/pages/form/demo-form.component.ts)
    - [DataTables](https://github.com/jojanper/angular-app/blob/master/src/app/widgets/datatables/datatables.component.ts)
      + [example](https://github.com/jojanper/angular-app/blob/master/src/app/pages/demo/demo.component.ts)
- Services
    - [Alert](https://github.com/jojanper/angular-app/blob/master/src/app/services/alert/alert.service.ts)
    - [Application events](https://github.com/jojanper/angular-app/blob/master/src/app/services/events/appevent.service.ts)

## License

[MIT](/LICENSE)
