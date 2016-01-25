angular.module('starter').factory('MedicoServices', ['$http',function($http) {

  var medicoService = {};

  medicoService.getMedicos= function(){
    return $http.get('data/medicos.geojson').then(function(response) {
      return response.data;
    });

  };

  return medicoService;

}]);
