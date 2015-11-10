var User = require('../model/user').User;
var bodyParser = require('body-parser');
var parser = bodyParser.json();
var fs = require('fs');
var jwt = require ('jsonwebtoken');
var express = require('express');
var oToken = express.Router();

oToken.use(function(req, res, next) {
    console.log(req.body);
    res.redirect('/');

});

oToken.post('/O/', function(req, res, next) {
        console.log(__dirname)
        res.render('index.html',function(err,html){
      res.send(html);
  });
    });



module.exports = refreshDirect