var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/public/index.html');
});

router.get('/action', function(req, res, next) {
  res.render('actiongames');
  console.log(res.statusCode);
});

router.get('/game', function(req, res, next) {

  res.render('game');
});

router.get('/RTY', function(error,req, res ,next){
  var status =  error.status;
  res.render('game');

  console.log(res.statusCode);
  console.log(error.statusCode);
});

router.use((error, req, res, next) => {
  console.log('Error status: ', error.status)
  console.log('Message: ', error.message)
})
module.exports = router;
