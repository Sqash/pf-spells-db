'use strict';

angular.module('pathfinderSpellsDbApp')
  .controller('ResultsCtrl', function ($scope, $rootScope, $http, $modal) {
    $scope.spells = $rootScope.currResults;

    $scope.showspell = function(name) {
      $http({
        url: '/api/database/spell',
        method: 'GET',
        params: { spellname: name }
      })
      .success(function(data, status, headers, config){
        var modalInstance = $modal.open({
          templateUrl: 'modal.html',
          controller: 'ModalCtrl',
          resolve: {
            spell: function(){
              return data;
            }
          },
          size: 'lg'
        });

        modalInstance.result.then(function() { return; });
      })
      .error(function(data, status, headers, config){
        alert("There was an error trying to retrieve spell data. Sorry!");
      });
    }

  });


angular.module('pathfinderSpellsDbApp')
  .controller('ModalCtrl', function ($scope, $modalInstance, spell) {
    $scope.spell = spell;
    $scope.done = function(){
      $modalInstance.close(null);
    }
  });
