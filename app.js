// var id = 2133;

// var dataUrl = "https://lastminute.firebaseio.com/promos/" + id + '/ofertas';

// var dataRef = new Firebase(dataUrl);

// dataRef.on('child_added', function(snapshot) {

// });

DEBUG = false;
ID = 2133;

angular.module('App', ['firebase'])

.service('Data', function($firebase) {

  var dataUrl = "https://lastminute.firebaseio.com/" + ID;
  var dataRef = new Firebase(dataUrl);
  var data = $firebase(dataRef);
  var offers = data.$child('offers');
  
  return {

    getOffers: function() {
      return offers;
    },

    getOffer: function(key) {
      return offers.$child(key);
    },

    addOffer: function(o) {
      offers.$add(o);
    },

    updateOffer: function(o,newOffer) {
      o.$set(newOffer);
    },

    deleteOffer: function(o) {
      o.$remove();
    }

  };

})

.controller('DashboardCtrl', function($scope,$firebase,Data) {

  $scope.offers = Data.getOffers();

  $scope.newOffer = function() {
    $scope.curOffer  = makeNewOffer();
  };

  $scope.setOffer = function(key) {
   $scope.curOffer = Data.getOffer(key);
  };


})

.controller('DetailCtrl', function($scope,Data) {

  $scope.$watch('curOffer', function() {
    if (isNewOffer($scope.curOffer)) {
      $scope.editMode = true;
      $scope.newMode = true;
    } else {
      $scope.editMode = false;
      $scope.newMode = false;
    }
    $scope.offer = angular.copy($scope.curOffer); 
  });

  $scope.cancel = function() {
    $scope.editMode = false;
    $scope.offer = angular.copy($scope.curOffer);
  };

  $scope.save = function() {
    $scope.editMode = false;
    if ($scope.newMode) {
      Data.addOffer($scope.offer);
    } else {
      Data.updateOffer($scope.curOffer,$scope.offer);
    }
    $scope.newMode = false;
  };

  $scope.edit = function() {
    $scope.editMode = true;
  };

  $scope.delete = function() {
    Data.deleteOffer($scope.curOffer);
  };

});


function loadDebug() {
  return {
    "name": "Hotel 1",
    "location": {
        "latitude": 41.75373,
        "longitude": -8.09017
    },
    "offers": [
      {
        "type": "quarto",
        "room": "duplo",
        "desc": "Quarto com vista para o mar",
        "price": "10€",
        "discount": "20%",
        "imgs": [
          "http://example.com/quarto1.jpg",
          "http://example.com/quarto2.jpg"
        ]
      }

    ]
  };
}


function isEmpty(obj) {
    for(var k in obj) {
        if(obj.hasOwnProperty(k))
            return false;
    }

    return true;
}

var makeNewOffer = function() {

  return {
    'type': 'room'
  };
};

var isNewOffer = function(){
  var def = makeNewOffer();
  
  return function(o) {
    return angular.equals(o,def);
  };

}();