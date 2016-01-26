angular.module('starter').controller('MapController', ['$scope',
  '$cordovaGeolocation',
  '$stateParams',
  '$ionicModal',
  '$ionicPopup',
  'LocationsService',
  'InstructionsService', 'MedicoServices', 'leafletData',
  function(
    $scope,
    $cordovaGeolocation,
    $stateParams,
    $ionicModal,
    $ionicPopup,
    LocationsService,
    InstructionsService, MedicoServices, leafletData
  ) {

    /**
     * Once state loaded, get put map on scope.
     */

     $scope.medicosFeatureArray={};
    $scope.$on("$stateChangeSuccess", function() {

      $scope.locations = LocationsService.savedLocations;
      $scope.newLocation;

      if (!InstructionsService.instructions.newLocations.seen) {

        var instructionsPopup = $ionicPopup.alert({
          title: 'Nexo Uy',
          template: InstructionsService.instructions.newLocations.text
        });
        instructionsPopup.then(function(res) {
          InstructionsService.instructions.newLocations.seen = true;
        });

      }




      $scope.map = {
        defaults: {
          tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          maxZoom: 18,
          zoomControlPosition: 'bottomleft'
        },
        markers: {},
        events: {
          map: {
            enable: ['context'],
            logic: 'emit'
          }
        }
      };

      $scope.goTo(0);
      $scope.loadMedicos();



    });

    var Location = function() {
      if (!(this instanceof Location)) return new Location();
      this.lat = "";
      this.lng = "";
      this.name = "";
    };

    $ionicModal.fromTemplateUrl('templates/addLocation.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });


    /**
     * Center map on specific saved location
     * @param locationKey
     */
    $scope.goTo = function(locationKey) {

      var location = LocationsService.savedLocations[locationKey];

      $scope.map.center = {
        lat: location.lat,
        lng: location.lng,
        zoom: 12
      };

/*
      $scope.map.markers[locationKey] = {
        lat: location.lat,
        lng: location.lng,
        message: location.name,
        focus: true,
        draggable: false
      };
*/
    };

    /**
     * Center map on user's current position
     */
    $scope.locate = function() {

      $cordovaGeolocation
        .getCurrentPosition()
        .then(function(position) {
          $scope.map.center.lat = position.coords.latitude;
          $scope.map.center.lng = position.coords.longitude;
          $scope.map.center.zoom = 15;

          $scope.map.markers.now = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            message: "You Are Here",
            focus: true,
            draggable: false
          };

        }, function(err) {
          // error
          console.log("Location error!");
          console.log(err);
        });

    };

    $scope.loadMedicos = function() {

      var  medicosLayer,onEachFeature = function(feature, layer) {
          // does this feature have a property named popupContent?
          var html, nombre, telefono,direccion,sitioWeb;
          console.log("Each Feature!!!");
          if (feature.properties) {
            nombre = feature.properties.nombre;
            telefono = feature.properties.telefono;
            direccion = feature.properties.direccion;
            sitioWeb = feature.properties.sitio_web;
            html = '<p><b>'+nombre+'</b></p>'+
                    '<p><i>'+direccion+'</i></p>'+
           '<a class="text report-link" href=' + sitioWeb+'><p>' + sitioWeb + '</p></a>'+
         '<a class="item item-icon-left" href="tel:"'+telefono+'>'+telefono+
            '<i class="icon ion-ios-telephone-outline"></i>'+
        '</a>';
        layer.bindPopup(html);
          }

          if ($scope.medicosFeatureArray[feature.properties.id] === undefined) {
            $scope.medicosFeatureArray[feature.properties.id] = layer;
          }

        };
      MedicoServices.getMedicos().then(function(response) {
        $scope.medicos = response.features;
        leafletData.getMap().then(function(map) {
          medicosLayer= L.geoJson(response, {
            onEachFeature: onEachFeature
          });



/*
          medicosLayer.on('layeradd', function(e) {

            e.layer.eachLayer(function(_layer) {

              if ($scope.medicosFeatureArray[_layer.feature.properties.id] === undefined) {
                $scope.medicosFeatureArray[_layer.feature.properties.id] = _layer;
              }
            });

          });*/
         map.addLayer(medicosLayer);
        });
      });
    };

    $scope.goToMedico = function(medico) {
      var layer = $scope.medicosFeatureArray[medico.properties.id];
      leafletData.getMap().then(function(map) {
        map.setView(layer.getLatLng(), 14);
        layer.openPopup();
      });

    };


  }
]);
