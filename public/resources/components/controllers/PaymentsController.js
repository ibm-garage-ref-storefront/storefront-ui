app.controller('PaymentsController', ['$scope', '$window', '$location', 'UserInfoService', 'CONFIG', function($scope, $window, $location, UserInfoService, CONFIG) {

	console.log("Entering Payments Controller")

	$scope.loggedIn = UserInfoService.state.authenticated

	$scope.pay = function () {
		  console.log($scope.cardNum)
		  if ($scope.cardNum != "1111-2222-3333-4444") {
								$window.alert("Invalid Card details, please enter the correct details");
								$location.path("/payments");
						}
			else {
        $window.alert("Payment Successful");
				$location.path("/catalog");
			}
		}
}]);
