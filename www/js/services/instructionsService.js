angular.module('starter').factory('InstructionsService', [ function() {

  var instructionsObj = {};

  instructionsObj.instructions = {
    newLocations : {
      text : 'Bienvenido a Nexo, la plataforma que te permite tomar el control de tu salud',
      seen : false
    }
  };

  return instructionsObj;

}]);
