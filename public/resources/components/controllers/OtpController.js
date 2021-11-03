app.controller('OtpController', ['$scope', '$window', '$location', 'UserInfoService', 'CONFIG', function($scope, $window, $location, UserInfoService, CONFIG) {

	console.log("Entering Otp Controller")

	$scope.loggedIn = UserInfoService.state.authenticated

	$scope.submit = function () {
		  console.log($scope.otp)
		  if ($scope.otp != "12345") {
								$window.alert("Invalid OTP, please check your registered email or mobile number");
								$location.path("/otp");
						}
			else {
				$location.path("/customer");
			}
		}

}]);
