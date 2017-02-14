	
exports.NavController = function(AuthService,$scope,$http) {

  $scope.user="not logged in"
  AuthService.isLoggedIn().then(function(user){
	  $scope.user=(user.data)
  })

       
    
};
