(function(){
    'use strict'
    var auSrvc = angular.module("auService",[]);
    auSrvc.factory('Auth',['$q',function($q){
        var user;
        return{
            setUser : function(aUser){
                user = aUser;
            },
            isLoggedIn : function(){
                return(user)? user : false;
            },
            getUser :function(){
                return user;
            }
        }
    }])
})();
