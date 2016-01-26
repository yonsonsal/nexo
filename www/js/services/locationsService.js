angular.module('starter').factory('LocationsService', [ function() {

  var locationsObj = {};

  locationsObj.savedLocations = [
    {
      name : "Montevideo",
      lat : -34.890437,
      lng : -56.184082
    }
  
  ];




  return locationsObj;

}]);
