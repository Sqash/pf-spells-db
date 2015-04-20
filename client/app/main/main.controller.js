'use strict';

angular.module('pathfinderSpellsDbApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.randomSpell = [];

    $http.get('/api/database').success(function(result) {
      $scope.randomSpell = result;
    });

  });
