var User = require('../model/user').User,
    shortid =require('shortid'),
    bodyParser = require('body-parser'),
    parser = bodyParser.json(),
    fs = require('fs'),
    jwt = require ('jsonwebtoken'),
    cryptic = require('cryptic');
function getMe(req,res){
    User.findOne({user_name:req.body.user_name},{user_name:1, password:1}, function(err,doc){
        if(err)throw err;
        if(!doc){
            return res.status(404).send('Something went wrong when looking you up, please try again or contact help');
        }else {
            return res.json(doc);
        }
    })

};
function checkMe(req,res,supersecret){
    var vail = req.body.user_name.toUpperCase();
    User.findOne({vail:vail},'geo avatar email access_token', function(err,doc){
        if(err)res.status(500).send('Problem with the system try again later');
        if(!doc){
            return res.status(404).send('username not found');
        }else if(req.body.token !== doc.access_token){
            return res.status(403).send('your token has expired')
        }else{
            console.log('cool the tokens still match')
            console.log(doc)
            return res.json(doc)
        }
    })
};
function makeMe(req,res,supersecret){
    var vail = req.body.user_name.toUpperCase();
    User.findOne({vail:vail},'user_name email', function(err,doc){
        if(err)res.status(500).send('Problem with the system tyr again later').end();
        if(!doc){
            User.findOne({email:req.body.email},'email', function(err,doc){
                if(err)throw err;
                if(!doc){
                    var vail = req.body.user_name.toUpperCase();
                    var pswd = cryptic(req.body.password)
                    var salt = cryptic(shortid.generate())
                    var truePass = cryptic(pswd+salt)
                    var token = jwt.sign(req.body.user_name, supersecret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });
                    console.log("email not registered")
                    User.create({geo:{user_name:req.body.user_name,location:req.body.location},access_token:token ,salt:salt,password:truePass, email:req.body.email,vail:vail},function(err,doc){
                        if(err){
                            return res.status(500).send('Problem saving your profile');
                        }else{
                            return   res.json(doc)
                        }
                    });
                }else{
                    return res.status(500).send('looks like that email is registered');
                }
            });
        }
        else {
            return res.status(500).send('username is taken');
        }
    })
};
module.exports = function(app) {
    app.use(function(req, res, next) {
//check if the request has a token or if the request has an associated username
         if(!req.headers.cookie){ //req.body.token could be added if you are passing a toke as a payload
            //make a token and attach it to the body
            console.log('no cookies were found')
            req.body.token = token // this is just placing the cookie as a payload
            var token = jwt.sign({user_token_name:req.body.user_name},app.get('superSecret'), {
                expiresIn: 1 // expires in 1 mintue can be what ever you feel is neccessary
            });
             res.cookie('austin.nodeschool' , token,{ maxAge: 1000, httpOnly: true }) //this sets the cookie to the string rv3.co
         }
        if(!req.body.user_name){
             res.status(403).send('request has no username')
         }
        next()
    },function(req, res, next) {
//    console.log(req.headers)  this is here to show you the avilable headers to parse through and to have a visual of whats being passed to this function
        console.log('second')
            if(req.headers.cookie){
                console.log(req.headers.cookie) //the cookie has the name of the cookie
                var equals = '=';
                var inboundCookie = req.headers.cookie
                var cookieInfo = splitCookie(inboundCookie,equals)
                console.log(cookieInfo)
               var decoded = jwt.verify(cookieInfo[1], app.get('superSecret'));
                //var decoded = jwt.verify(cookieInfo[1], app.get('superSecret'));
                console.log(decoded)
                // You could check to see if there is an access_token in the database if there is one
                // see if the decoded content still matches. If anything is missing issue a new token
                // set the token in the database for later.
            }
    next()

    });
    app.post('/js/login', parser, function(req,res){
        console.log('made it to auth_api')
        var supersecret = app.get('superSecret');
        checkMe(req, res,supersecret);
    });
    app.post('/js/signup', parser, function(req,res){
        var supersecret = app.get('superSecret');
        makeMe(req, res,supersecret);
    });
};