var express = require('express');
var router = express.Router();
const {parse} = require('json-parser');
const jwt = require('jsonwebtoken')
const keys = require('../config/keys');
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(keys.url, { useNewUrlParser: true });
const bcrypt = require('bcrypt');
var token = null;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/action', function(req, res, next) {
  res.render('gameslist', {title: "Action" });
  console.log(res.statusCode);
});
router.get('/rpg', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalogDB");
    const collection = db.collection("games");
    if(err) return console.log(err);

    collection.find({genre: "rpg"}).toArray(function(err, results){

      res.render("adventure", {title: "RPG" , writes: results });
      //console.log(results);

    });
  });
});

router.get('/profile', function(req, res, next) {
  mongoClient.connect( function(err, client) {
    const db = client.db("gkatalogDB");
    const collection = db.collection("users");
    decoded = jwt.verify(token, keys.jwt);

    var user = collection.find({_id: decoded.userId})
    console.log(user);
    res.render('profile', {user: user})
  });
});

router.post('/profile', function(req, res, next) {
  mongoClient.connect( function(err, client) {
    const db = client.db("gkatalogDB");
    const collection = db.collection("users");
    //db.users.update({name : "Tom"}, {OC: "Tom", age : 25}, {upsert: true})
   //collection.updateOne({email : decoded.email}, {name: "Tom", age : 25}, {upsert: true})
  });
  console.log(req.body);
});

router.get('/registerAuth', function(req, res, next) {
  if (token != null){

  }
  else{
    res.render('registerAuth');
    console.log(res.statusCode);
  }
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
    if(req.body.login === '') {
      const password = bcrypt.compareSync(req.body.password, candidate.passwd)
      if (password) {

        token = jwt.sign({
          email: candidate.email,
          userId: candidate._id
        }, keys.jwt, {expiresIn: 3600})
        var decoded = jwt.verify(token, keys.jwt);
        var user = collection.findOne({_id: decoded.userId})
        res.render('profile', {user: candidate})

      }
    }
    if(req.body.submit === ''){
        mongoClient.connect( function(err, client) {
          const db = client.db("gkatalogDB");
          const collection = db.collection("users");
          var decoded = jwt.verify(token, keys.jwt);
          console.log(decoded);
          collection.updateOne({email : decoded.email}, { $set: {OC: req.body.oc, CPU : req.body.cpu, RAM:req.body.ram, GPU:req.body.gpu}}, { upsert: true })
          res.render('profile',{user: candidate})
        });
      }



 });



    //delete req.body['counter'];
});

router.get('/adventure', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalogDB");
    const collection = db.collection("games");
    if(err) return console.log(err);

    collection.find({genre: "adventure"}).toArray(function(err, results){

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
    const shops = db.collection("shops")
    var games;

   gamecollection.find({name: "Cyberpunk 2077"}).toArray(function(err, results){


     sysreqs.find({name: "Cyberpunk 2077"}).toArray(async function(err, rslt){
       console.log(results[0].mart);
          for (var i = 0; i< Object.keys(results[0].mart).length ; i++){
            const shop = await shops.findOne({_id: results[0].mart[i]});
            results[0].mart[i] = shop.shop;

          }

       res.render("game", {title: "Cyberpunk 2077" , writes: results, sysreqss:rslt, request: "Вероятнее всего не потянет"});

     });

    });
  });
});

router.get('/:id', function(req, res, next) {
  mongoClient.connect(function(err, client){

    const db = client.db("gkatalogDB");
    const gamecollection = db.collection("games");
    const sysreqs = db.collection("sysreq");
    const shops = db.collection("shops")
    var games;
    gamecollection.find({name: req.params.id}).toArray(function(err, results){

      sysreqs.find({name: req.params.id}).toArray(async function(err, rslt){

        for (var i = 0; i< Object.keys(results[0].mart).length ; i++){
          const shop = await shops.findOne({_id: results[0].mart[i]});
          results[0].mart[i] = shop.shop;

        }
        gamecollection.find().toArray(function(err, rs){
        res.render("game", {title: req.params.id , writes: results, sysreqss:rslt , rs: rs });
        });
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
