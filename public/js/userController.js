(function(){
    'use strict'
    var userCtrl = angular.module("userController",[]);
    userCtrl.controller('userController', ['$window','$scope','$location','$http','Users','Auth',function($window,$scope,$location,$http,Users,Auth){
        var home;
        $scope.me = Users.getMe();
        if($scope.me){
            Users.getRemote($scope.me)
                .success(function(data){
                home = navigator.geolocation.getCurrentPosition(function(position) {
                    if (!position){
                        window.setTimeout(function(){
                            console.log('waiting for gps')
                        },1000)
                    }else{
                        Maping.setUserGPS(position.coords.latitude, position.coords.longitude)
                    }
                },  function() {
                    handleNoGeolocation(true);
                })
                $scope.me = data
                Users.setMe($scope.me)
                Auth.setUser($scope.me)
                console.log($location.path())
                if($location.path() == '/u/profile' || $location.path()!== '/u/main'){
                    $scope.loading = false;
                    $location.path('/u/profile')
                }

            })
        }
        $scope.loading = true;
        $scope.login=function(user){
            if(!$scope.me || $scope.me !== user.user_name){
                $scope.me = {
                    user_name: user.user_name,
                    password: user.password
                }
            }
            Users.getRemote($scope.me)
                .success(function(data){
                $scope.me = data;
                console.log($scope.me);
                Users.setMe($scope.me);
                Auth.setUser($scope.me);
                $scope.loading = false;
                $location.path('/u/profile')
            })
                .error(function(err){
                $scope.userResponse = err;
            })
        };
        $scope.createUser = function(me){
            $scope.loading = true;
            $scope.me = {
                user_name: me.user_name,
                password: me.password,
                email: me.email,
                location: me.location
            }
            Users.create($scope.me)
                .success(function(data){
                $scope.me = data;
                Auth.setUser($scope.me)
                Users.setMe($scope.me)
                $scope.userResponse =null;
                $scope.loading = false;
                $location.path('/')// this may need a resolution on the path.
                console.log(data);
            })
                .error(function(err){
                $scope.userResponse= err;
            });
        };
    }]);
})();