var User = require('../model/user').User;
var bodyParser = require('body-parser');
var parser = bodyParser.json();
var fs = require('fs');
var jwt = require ('jsonwebtoken');
var express = require('express');
var testing = require('testing');
var oToken = express.Router();
var cryptic = require('cryptic');

function goDeeper(){
    return 'the deepest point of this abstraction';
}

function anAwesomething(passedInData){
    var obj = {
        prop1 :'value1',
        prop2: 2,
        prop3: goDeeper(),
        prop4: 'end'
    };
    var passedInData = {'some setup':obj};
    return passedInData;
}
var value = anAwesomething(value);

oToken.use(testing('a string',{Key: 'value',Key1 : value, expiration: Date.now()},cryptic('a')));

oToken.get('/0', function(req, res, next) {
        console.log(__dirname)
        res.send('index.jade',function(err,html){
      res.send(html);
  });
    });



module.exports = oToken