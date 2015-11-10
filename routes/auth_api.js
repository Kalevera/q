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
         if(!req.body.token||!req.headers.cookie){
             console.log('no cookies were found')
            //make a token and attach it to the body
            var token = jwt.sign(shortid.generate(),app.get('superSecret'), {
                expiresInMinutes: 1 // expires in 1 mintue can be what ever you feel is neccessary
            });
            req.body.token = token; // this adds a token to the body. every time setting the expiration to 1 minute
              res.cookie('austin.nodeschool' , token) //this sets the cookie on the window to the string rv3.co
         }
        if(!req.body.user_name){
             res.status(403).send('request has no username')//this is here because I want the req to be associated with a user name in the logs could be something else could be nothing depeing on the needs.
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