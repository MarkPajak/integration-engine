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


exports.date_select_controller = function($location, $scope, $routeParams, $http) {

	
			$scope.start_date=new Date("04/01/2019") //NEW FINANCIAL YEAR - CHANGE THIS
			$scope.end_date= moment($scope.start_date).add('years', 1).format("DD/MM/YYYY")

			
};





exports.refreshButtonKeycontroller = function($location, $scope, $routeParams, $http) {


};

