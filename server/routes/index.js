var express = require('express');
var router = express.Router();
var Firebase = require('firebase');

var ref = new Firebase('https://luminous-inferno-872.firebaseio.com/');
var userRef = ref.child('users');
// var indUserRef = null;
var peopleArray = [];


userRef.on('value', function(snapshot){
  console.log(snapshot.val());
});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Firebase Tester' });
});

router.post('/user/login', function(req, res, next){
    ref.authWithPassword({
    email    : req.body.loginEmail,
    password : req.body.loginPassword
  }, authHandler);
    saveUser();
    res.redirect('/');
});

router.post('/user/logout', function(req, res, next){
  peopleArray = [];
  uid = null;
  indUserRef = null;
  indUserRefArray = null;
  ref.unauth();
  console.log('logged out');
  res.redirect('/');
});

router.post('/users', function(req, res, next){
    ref.createUser({
    email    : req.body.email,
    password : req.body.password
    }, function(error, userData) {
    if (error) {
      console.log("Error creating user:", error);
    } else {
      res.status("Successfully created user account with uid:").redirect('/');
    }
  });
});

router.post('/', function(req, res, next){
  var authData = ref.getAuth();
  console.log(authData);
  if(authData){
    console.log('home get auth : ', authData);
    var name = req.body.name;
    var age = req.body.age;
    var person = new Person(name, age);
    peopleArray.push(person);
    var indUserRef = userRef.child(uid);
    var indUserRefArray = indUserRef.child('people');
    indUserRefArray.set(peopleArray);
    res.json(peopleArray);
  } else {
    res.json('You\'re not logged in!!!');
  }
});

module.exports = router;

// *** helper functions *** //

var Person = function(name, age){
  this.name = name;
  this.age = age;
};

function authHandler(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Authenticated successfully with payload:", authData);
  }
}


function saveUser(){
  ref.onAuth(function(authData) {
    if (authData) {
      uid = authData.uid;
      ref.child("users").child(authData.uid).set({
        provider: authData.provider,
        email: authData.password.email,
      });
    }
  });
}

