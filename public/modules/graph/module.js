/**
 * Created by benoitlaurent on 21/09/16.
 */
import angular from 'angular';
import 'angular-ui-router';

// Controllers
import ACtrl from './controllers/iot';

// Hmmm... what's the right way to do this
// so this module doesn't have to know where it lives?
let path = './modules/graph/';

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
let GraphModule = angular.module('GraphModule', [
  'ui.router'
])

// Controllers
  .controller('ACtrl', ACtrl)

  // Routes
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('iot', {
        url: '/',
        controller: 'ACtrl',
        templateUrl: path + 'views/demo-iot.html',
        controllerAs: 'vm'
      });
  }]);

export default GraphModule;
