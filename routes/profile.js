var locals = require('mainLocals');

/* GET profile page. */
module.exports = function(app) {
  app.get('/u/profile', function(req, res, next) {
    res.render('profile',locals(),function(err,html){
        res.send(html);
    });
  });
}
