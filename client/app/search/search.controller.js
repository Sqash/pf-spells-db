'use strict';

angular.module('pathfinderSpellsDbApp')
  .controller('SearchCtrl', function ($scope, $http, $rootScope, $location) {

    $scope.formfields = {};

    $scope.search = function(){
      for(var item in $scope.formfields) {
        if($scope.formfields.hasOwnProperty(item) && $scope.formfields[item] === ""){
          delete $scope.formfields[item];
        }
      }
      if(Object.getOwnPropertyNames($scope.formfields).length === 0){
        alert("Input at least 1 filter for your search!");
        return;
      } else {
        $http({
          url: "/api/database/query",
          method: "GET",
          params: $scope.formfields
        })
          .success(function(data, status, headers, config){
            console.log("Success in retrieving data (" + data.length + " results)");
            if(data.length === 0) {
              alert("No results for your query!");
            } else {
              $rootScope.currResults = data;
              $location.url('/results');
            }
        })
          .error(function(data, status, headers, config){
            console.log("There was an error in retrieving the query.");
            alert("There was an error processing your query!\nSorry, about that. Please try again or report the error.");
        });
      }
    }

  });
