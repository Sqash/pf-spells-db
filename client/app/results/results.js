'use strict';

angular.module('pathfinderSpellsDbApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/results', {
        templateUrl: 'app/results/results.html',
        controller: 'ResultsCtrl'
      });
  });
