var express = require('express');
var router = express.Router();
const {parse} = require('json-parser');
const jwt = require('jsonwebtoken')
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://logisxxx:logisxxx@gkatalogcluster-kazba.mongodb.net/test?retryWrites=true&w=majority";
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
const bcrypt = require('bcrypt');
const keys = require('../config/keys');
var db , users , games;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('/public/index.html');
});

router.get('/action', function(req, res, next) {
  res.render('gameslist', {title: "Action" });
  console.log(res.statusCode);
});
router.get('/action', function(req, res, next) {
  res.render("gameslist", {title: "Action" });
  console.log(res.statusCode);
});

router.get('/profile', function(req, res, next) {
  res.render('profile');
  console.log(res.statusCode);
});

router.get('/registerAuth', function(req, res, next) {
  res.render('registerAuth');
  console.log(res.statusCode);
});






router.post('/registerAuth', function(req, res, next) {
  const salt = bcrypt.genSaltSync(10);
  mongoClient.connect(async function(err, client) {
    const db = client.db("gkatalogDB");
    const collection = db.collection("users");
    const candidate = await collection.findOne({email: req.body.email})

    if (req.body.sign === ''){
      if (candidate){
        res.status(409).send(req.body.email + " - такой email уже есть в базе");
      }else {
        req.body.passwd = bcrypt.hashSync(req.body.passwd, salt)
        await collection.insertOne(req.body);
        res.redirect("/registerAuth");
      }
    }
    else if(req.body.login === ''){
      console.log(req.body.password);
      console.log(candidate.passwd);
      const password = bcrypt.compareSync(req.body.password , candidate.passwd)
      if (password){

        const token = jwt.sign({
        email: candidate.email,
        userId: candidate._id
        },keys.jwt,{expiresIn: 3600})
        res.status(200).send({
          token: token
        })


      }else {

      }
    }


 });

    console.log(req.body);
    //delete req.body['counter'];

});






router.get('/adventure', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalogDB");
    const collection = db.collection("games");
    const active = ['active','','',''];
    if(err) return console.log(err);

    collection.find().toArray(function(err, results){

      res.render("adventure", {title: "Adventure" , writes: results });
      //console.log(results);

    });
  });
});

router.get('/admin', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalog");
    const collection = db.collection("games");
    const active = ['active','','',''];
    if(err) return console.log(err);

    collection.find().toArray(function(err, results){

      res.render("admin", {title: "admin" , writes: results , active: active});
      //console.log(results);

    });
  });



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
