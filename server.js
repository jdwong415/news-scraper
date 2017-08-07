var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
var PORT = process.env.PORT || 8080;

mongoose.connect('');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static('public'));

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});