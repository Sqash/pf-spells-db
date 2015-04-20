'use strict';

describe('Controller: LegalCtrl', function () {

  // load the controller's module
  beforeEach(module('pathfinderSpellsDbApp'));

  var LegalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LegalCtrl = $controller('LegalCtrl', {
      $scope: scope
    });
  }));

  it('should pass a basic spec because it does nothing', function () {
    expect(1).toEqual(1);
  });
});
