import angular from 'angular';
import 'angular-ui-router';

import GaugeLinearModule from '../../bower_components/gauge-linear/dist/module';
import ChartColumnModule from '../../bower_components/chart-column/dist/module';

// Controllers
import ACtrl from './controllers/a';

// Hmmm... what's the right way to do this
// so this module doesn't have to know where it lives?
let path = './modules/one/';

/**
 * @ngdoc object
 * @name OneModule
 * @description
 * A module skeleton.
 * @example
 * ```
    import OneModule from './<path to here>/module.js';
    let AppModule = angular.module('app', ['OneModule']);
 * ```
 */
let OneModule = angular.module('OneModule', [
    'GaugeLinearModule',
    'ChartColumnModule',
    'ui.router'
  ])

  // Controllers
  .controller('ACtrl', ACtrl)

  // Routes
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('a', {
        url: '/',
        controller: 'ACtrl',
        templateUrl: path + 'views/a.html',
        controllerAs: 'vm'
      })
      .state('subnav1',{
       url: '/subnav1',
       controller: 'ACtrl',
       templateUrl: path + 'views/subnav1.html',
       controllerAs: 'vm'
      })
      .state('subnav2',{
        url: '/subnav2',
        controller: 'ACtrl',
        templateUrl: path + 'views/subnav2.html',
        controllerAs: 'vm'
      })
      .state('detail',{
         url: '/detail/3',
         controller: 'ACtrl',
         templateUrl: path + 'views/subnav1.html',
         controllerAs: 'vm'
       })
      .state('settings',{
         url: '/settings',
         controller: 'ACtrl',
         templateUrl: path + 'views/subnav1.html',
         controllerAs: 'vm'
       })
      .state('profile',{
         url: '/profile',
         controller: 'ACtrl',
         templateUrl: path + 'views/subnav2.html',
         controllerAs: 'vm'
       })
      .state('detail-4th',{
         url: '/detail/4',
         controller: 'ACtrl',
         templateUrl: path + 'views/subnav2.html',
         controllerAs: 'vm'
       });
  }]);

export default OneModule;
