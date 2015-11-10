(function(){
    'use strict'
    var angularApp = angular.module("mainRoom",['auService','me','userService','mu','userController','ngResource','ngRoute']);
    angularApp.controller('mainCtrl', ['$scope', 'Auth', '$location', function ($scope, Auth, $location) {
        $scope.$watch(Auth.isLoggedIn, function (value, oldValue) {
            if(!value && oldValue) {
                console.log(oldValue)
                $location.path('/');
            }
            if(value) {
                console.log(value)
                //Do something when the user is connected
            }
        }, true)
    }])
    angularApp.config(['$routeProvider' ,'$locationProvider', function($routeProvider,$locationProvider){
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {templateUrl: '/u/login.html', controller: 'userController'});
        $routeProvider.when('/u/signup', {templateUrl: '/u/signUp.html', controller: 'userController'});
        $routeProvider.when('/u/main', {templateUrl: '/u/main.html', controller: 'userController'});
        $routeProvider.when('/u/profile', {templateUrl: '/u/profile.html', controller: 'userController'});
    }]).run(['$rootScope', '$location', 'Auth','$route','$routeParams',function($rootScope, $location,Auth,$route,$routeParams){
        $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection){
            if (rejection === 'not authorized') {
                $location.path('/');
            }
        })
        $rootScope.$on('$routeChangeStart', function (event) {
            if (!Auth.isLoggedIn()) {
                var test = $location.path()
                if(test =='/u/signup'){
                    $location.path('/u/signup')
                }else{
                $location.path('/');
                }
            }else {
                console.log('ALLOW');
                var path = $location.path()
                $location.path(path);
            }
        })
    }])
})();