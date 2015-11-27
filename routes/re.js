var User = require('../model/user').User;
var bodyParser = require('body-parser');
var parser = bodyParser.json();
var fs = require('fs');
var jwt = require ('jsonwebtoken');
var express = require('express');
var refreshDirect = express.Router();

refreshDirect.use(function(req, res, next) {
    console.log(req.path);
    res.redirect('/');

});

refreshDirect.get('/u/', function(req, res, next) {
        console.log(__dirname)
        res.render('index.html',function(err,html){
      res.send(html);
  });
    });

module.exports = refreshDirect