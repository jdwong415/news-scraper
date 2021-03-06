var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static('public'));

mongoose.Promise = require('bluebird');

var databaseUri = "mongodb://localhost/scraper"
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
  });
}
else {
  mongoose.connect(databaseUri, {
    useMongoClient: true
  });
}

var db = mongoose.connection;

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

app.use(require('./controllers/routes'));

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});