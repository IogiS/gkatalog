var express = require('express');
var router = express.Router();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://logisxxx:logisxxx@gkatalogcluster-kazba.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/public/index.html');
});

router.get('/action', function(req, res, next) {
  res.render('gameslist', {title: "Action" });
  console.log(res.statusCode);
});
router.get('/action', function(req, res, next) {
  res.render('gameslist', title);
  console.log(res.statusCode);
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
  console.log(res.statusCode);
});

router.get('/game', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalogDB");
    const gamecollection = db.collection("games");
    const sysreqs = db.collection("sysreq");

    var games;

   gamecollection.find({name: "Cyberpunk 2077"}).toArray(function(err, results){


     sysreqs.find({name: "Cyberpunk 2077"}).toArray(function(err, rslt){


       res.render("game", {title: "Cyberpunk 2077" , writes: results, sysreqss:rslt });

     });

    });





  });



});

router.use((error, req, res, next) => {
  console.log('Error status: ', res.statusCode)
  console.log('Message: ', error.message)
  res.render('refactor')
})
module.exports = router;
