var User = require('../model/user').User, //mongoose schema model.
    bodyParser = require('body-parser'),
    parser = bodyParser.json();
function getUsers(res){
	User.find('users',function(err, users){
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			res.send(err)
		}else{

			res.json(users); // return all users in JSON format
		}
	})
};
function getMe(req, res){
	User.findOne({_id:req.body.id},{user_name:1, email:1, location:1},function(err, users){
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err){
			res.send(err)
		}else{
			res.json(users); // return all users in JSON format
		}
	})
};
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all users Currently only used for dev comment out and delete for production
	app.get('/js/user', function(req, res) {
        //GET ALL USERS
		// use mongoose to get all users in the database
		getUsers(res);
	});


	// check user and send back all users after creation
	app.post('/js/user', parser, function(req, res,next) {
        console.log(req.body)
		var a = req.body.user_name,
		    b = req.body.password;

        console.log("hey the user request has this in it: "+ a,b)
        // place a function which passes the password to be salted and hashed. while i request to see if i'm in the database.

        User.findOne({user_name:a},{ user_name: 1, email: 1 },function(err,user){
            if(err){
               res.sendStatus(500);
            }else if(!user){
               res.sendStatus(500);
            }else{

                console.log('success retriving user from DB', user)
                // get and return yourself after sign-in.
                res.sendStatus(200);
                res.send(res);
            }
        });
	});
	// delete a user
	app.delete('/js/user:user_id', function(req, res) {
		User.remove({
			_id : req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);

			getUsers(res);
		});
	});
};