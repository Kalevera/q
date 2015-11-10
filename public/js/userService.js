(function(){
    var me;
	var userSrvc = angular.module("userService",[]);
	userSrvc.factory('Users',['$window','$http',function($window,$http){
        function setLocal(userData){
            var localUser = window.localStorage.getItem('rv3.co.user_name')
            var localAccess_token = window.localStorage.getItem('rv3.co.access_token')
            var localKitchens = window.localStorage.getItem('rv3.co.kitchens')
            var localemail = window.localStorage.getItem('rv3.co.email')
             var locallocation = window.localStorage.getItem('rv3.co.location')
             //set the user in local storge and in angualr memory
            if(!localAccess_token){
                console.log("local sotrage missing")
                console.log(userData)
                window.localStorage.setItem('rv3.co.user_name',userData.user_name)
                window.localStorage.setItem('rv3.co.access_token',userData.access_token)
                return me
            }else{
                console.log("setting local storage")
                if(userData.geo.user_name){
                    window.localStorage.setItem('rv3.co.user_name',userData.geo.user_name)
                }
                if(userData.access_token){
                    window.localStorage.setItem('rv3.co.access_token',userData.access_token)
                }
                if(userData.kitchens){
                     window.localStorage.setItem('rv3.co.kitchens',userData.geo.kitchens)
                }
                if(userData.email){
                    window.localStorage.setItem('rv3.co.email',userData.email)
                }
                if(userData.geo.location){
                    window.localStorage.setItem('rv3.co.location',userData.geo.location)
                }
                return me
            }

        }
        function getLocal(){
            var localUser = window.localStorage.getItem('rv3.co.user_name')
            var localAccess_token = window.localStorage.getItem('rv3.co.access_token')
            var localKitchens = window.localStorage.getItem('rv3.co.kitchens')
            var localemail = window.localStorage.getItem('rv3.co.email')
             var locallocation = window.localStorage.getItem('rv3.co.location')
            if (!localUser){
                console.log('no local user')
            }
            var user = {user_name:localUser,location:locallocation,access_token:localAccess_token,kitchens:localKitchens,localemail:localemail}
            return user
        }
        function getapi(userData){
            //check for local storage of user name
            var local = window.localStorage.getItem('rv3.co.user_name');
            if (!local){
                // if no local storage of the user_name and no Angular user in memory then set the Angualr user in memory
                // and authenticate the routes
                setLocal(userData);
                return $http.post('/js/login', userData);
            }else{
                return $http.post('/js/login',userData);
            }

        };

		return{
			get:function(){
				return $http.get('/js/user');
			},
			create:function(userData){
				return $http.post('/js/signup', userData);
			},
			delete: function(id){
				return $http.delete('/js/user', id );
			},
            getRemote:function(userData){
                return getapi(userData)
            },
            getMe: function(){
                    return getLocal()
            },
            setMe: function(userData){
                me = userData
                setLocal(userData)
            }
		}
	}])
})();