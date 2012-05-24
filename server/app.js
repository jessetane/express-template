/*
 *  App
 *
 */

var packageJSON = require("../package");
var _ = require("underscore");
var fs = require("fs");
var crypto = require("crypto");
var http = require("http");
var stylus = require('stylus');
var uaparser = require('ua-parser');
var express = require('../node_modules/express');
var connect = require('../node_modules/connect');
var stitch = require('../node_modules/stitch');
var coffee = require("../node_modules/coffee-script");

app = express.createServer();


// helpers
// -------

function serveModel (req, res, model) {
  var header = { 
    'content-type': 'text/json',
    "cache-control": "max-age=0",
    "etag": model.etag,
  }
  if (connect.utils.modified(req, res, header)) {
    var data = JSON.stringify(model);
    res.writeHead(200, header);
    res.write(data);
    res.end();
  } else {
    res.writeHead(304);
    res.end();
  }
}

// cache.manifest doesn't work the way i would expect...
// the only issue with this approach is that anything 
// that needs to be compiled on the fly won't work - 
// ie stylus for css or stitch for javascript packages
function staticCache (req, res, next) {
  res.setHeader("cache-control", "max-age=99999999");
  next();
}

staticVersion = function staticVersion (filename) {
  try {
    var fdata = fs.readFileSync(__dirname + "/public" + filename)
    var hash = crypto.createHash("md5");
    hash.update(fdata);
    return filename + "?v=" + hash.digest("hex");
  } catch (e) {
    return filename;
  }
}

function detectClient (req) {
  
  // for now - we don't have a mobile site yet
  return "desktop";
  
  // force it with a query param - ie: url?site=mobile
  var force = req.query.site;
  if (force && (force == "desktop" || force == "mobile")) return force;
  
  // or let us take care of it
  var ua = req.headers['user-agent'];
  var client = ua.toLowerCase().search("mobile") > -1 ? "mobile" : "desktop";
  return client;
}


// Config
// ------

app.configure(function () {
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname, dest: __dirname + '/public' }));
  app.use(connect.basicAuth(function (user, pass) { return 'a' == user && 'b' == pass }));
  app.use(app.router);
  app.use(staticCache);
  app.use(express.static(__dirname + '/public'));
});

// Development
app.configure('development', function () {
  stitch.compress = false;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.listen(3000);
});

// Production!
app.configure('production', function () {
  stitch.compress = true;
  app.use(express.errorHandler());
  app.listen(8000);
});


// CSS
// ---

fs.unlink(__dirname + '/public/style/desktop/style.css');


// Models
// ------

var models = {}
var modelNames = [
  "common",
  "index",
  "one",
  "two",
]
_.each(modelNames, function (modelName) {
  var path = __dirname + "/models/" + modelName + ".coffee";
  var model = require(path);
  models[modelName] = model;
  var hash = crypto.createHash("md5");
  hash.update(JSON.stringify(model));
  model.etag = hash.digest("hex");
});


// Client applications (javascript bundles)
// -------------------

// desktop
var desktopApp = stitch.createPackage({
  paths: [ __dirname + '/../desktop' ],
  compress: stitch.compress,
}).compile(function (err, source) {
  fs.writeFile(__dirname + '/public/script/desktop.js', source);
});


//  Routes
//  ------

app.get("/", function (req, res) {
  var client = models.common.client = detectClient(req);
  res.render(client + "/index", models);
});

app.get("/one", function (req, res) {
  var client = models.common.client = detectClient(req);
  res.render(client + "/one", models);
});

app.get("/two", function (req, res) {
  var client = models.common.client = detectClient(req);
  res.render(client + "/two", models);
});


// API
// ---

app.get("/api/v1/common", function (req, res) {
  serveModel(req, res, models.common);
});

app.get("/api/v1/index", function (req, res) {
  serveModel(req, res, models.index);
});

app.get("/api/v1/one", function (req, res) {
  serveModel(req, res, models.one);
});

app.get("/api/v1/two", function (req, res) {
  serveModel(req, res, models.two);
});


// go!
console.log("%s version %s running on port %d in %s mode", packageJSON.name, packageJSON.version, app.address().port, app.settings.env);
