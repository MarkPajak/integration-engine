exports.ProductDetailsController = function($location, $scope, $routeParams, $http) {

  var encoped = encodeURIComponent($routeParams.id);
  $http.
    get('/api/v1/product/id/' + encoded).
    success(function(data) {
      $scope.product = data.product;
    });
  setTimeout(function() {
    $scope.$emit('ProductDetailsController');
  }, 0);
};


exports.RadioController = function($location, $scope, $routeParams, $http) {

  $scope.formData = {};
   $scope.monthWeek = "month"
};




exports.refreshButtonKeycontroller = function($location, $scope, $routeParams, $http) {


};

