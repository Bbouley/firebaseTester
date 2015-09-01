var express = require('express');
var router = express.Router();
var Firebase = require('firebase');

var ref = new Firebase('https://luminous-inferno-872.firebaseio.com/');
var peopleRef = ref.child('people');
var peopleArray = [];

ref.on('value', function(snapshot){
  console.log(snapshot.val());
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Firebase Tester' });
});

router.post('/users', function(req, res, next){
    ref.createUser({
    email    : req.body.email,
    password : req.body.password
    }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      res.status("Successfully created user account with uid:").json(userData.uid);
    }
  });
});

router.post('/', function(req, res, next){
  var name = req.body.name;
  var age = req.body.age;
  var person = new Person(name, age);
  peopleArray.push(person);
  peopleRef.set(peopleArray);
  res.json(peopleArray);
});

module.exports = router;

var Person = function(name, age){
  this.name = name;
  this.age = age;
};

