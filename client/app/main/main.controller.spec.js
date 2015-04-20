'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('pathfinderSpellsDbApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond({spellname: "Fireball", desc: "A fiery explosion deals 1d6/lvl dmg"});

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should have two keys in the object', function () {
    $httpBackend.flush();
    expect(scope.randomSpell.keys().length).toBe(2);
  });
});
