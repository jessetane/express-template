/*
 *  App
 *
 */


var _ = require("underscore");
var http = require("http");
var stylus = require('stylus');
var express = require('../node_modules/express');
var connect = require('../node_modules/connect');
var stitch = require('../node_modules/stitch');
var app = express.createServer();


// Config
app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({
    src: __dirname,
    dest: __dirname + '/public'
  }));
  //app.use(connect.basicAuth(function (user, pass) { return 'guestd' == user && 'p4ssw0rd' == pass }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Development
app.configure('development', function () {
  stitch.compress = false;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.listen(3000);
  console.log("Express server running in development on port %d in %s mode", app.address().port, app.settings.env);
});

// Production!
app.configure('production', function () {
  stitch.compress = true;
  app.use(express.errorHandler());
  app.listen(8002);
  console.log("Express server running in production on port %d in %s mode", app.address().port, app.settings.env);
});


// Stitch JS bundles
// -----------------

// desktop js
var desktopApp = stitch.createPackage({
  paths: [ __dirname + '/../desktop' ],
  compress: stitch.compress,
  cache: true,
})

// mobile js
var mobileApp = stitch.createPackage({
  paths: [ __dirname + '/../mobile' ],
  compress: stitch.compress,
  cache: true,
})


//  Routes
//  ------

app.get("/desktop.js", desktopApp.createServer());
app.get("/mobile.js", mobileApp.createServer());

app.get("/", function (req, res) { res.render("index") })
app.get("/one", function (req, res) { res.render("one") })
app.get("/two", function (req, res) { res.render("two") })

