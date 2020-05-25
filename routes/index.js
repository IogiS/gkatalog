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
  res.render('gameslist');
  console.log(res.statusCode);
});

router.get('/game', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalogDB");
    const collection = db.collection("games");

    //db.games.aggregate([
    //{ $lookup: { from: "sysreq", localField: "name", foreignField: "name", as: "result" } }])

    if(err) return console.log(err);

    collection.find({name: "Cyberpunk 2077"}).toArray(function(err, results){

      res.render("game", {title: "Cyberpunk 2077" , writes: results });
      console.log(results);

    });
  });



});

router.get('/gamew', function(req, res, next) {
  try {
    res.render('222');
  }
  catch (e) {
    res.status(404).send(

        res.render('refactor')
    )
  }
});

router.use((error, req, res, next) => {
  console.log('Error status: ', res.statusCode)
  console.log('Message: ', error.message)
  res.render('refactor')
})
module.exports = router;
