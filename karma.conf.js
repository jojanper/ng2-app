// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const _config = {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-mocha-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: [ 'text', 'text-summary', 'lcovonly' ],
      fixWebpackSourcePaths: true,
      'report-config': {
          lcovonly: {
            file: 'coverage.lcov'
          }
        }
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeLocal'],
    customLaunchers: {
      ChromeLocal: {
        base: 'ChromeHeadless',
        flags: ['--disable-translate', '--disable-extensions']
      },
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true
  };

  if (config.travis) {
    _config.browsers = ['Chrome_travis_ci'];
  }

  config.set(_config)
};
