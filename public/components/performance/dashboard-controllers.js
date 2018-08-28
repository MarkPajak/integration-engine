exports.dashboard_controller = function($route,$scope ) {
		
$scope.dashboard = true
		$scope.refresh=function(link) {
			
			 window.open(link, '_blank');
		
		}

}


