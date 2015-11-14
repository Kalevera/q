var express = require('express');
var router = express.Router();
var locals = require('mainLocals');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',locals(),function(err,html){
      res.send(html);
  });
});

module.exports = router;
