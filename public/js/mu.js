(function(){
'use strict'
var menuCtrl = angular.module("mu",[]);
menuCtrl.controller('mu', ['$scope',function($scope){
    $scope.mState=false;
    $scope.muToggle = function(){
        $scope.mState = !$scope.mState
	};
}]);
})();