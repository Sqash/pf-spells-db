'use strict';

angular.module('pathfinderSpellsDbApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/legal', {
        templateUrl: 'app/legal/legal.html',
        controller: 'LegalCtrl'
      });
  });
