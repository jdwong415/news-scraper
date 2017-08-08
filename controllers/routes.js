const express = require('express');
const router = express.Router();
var cheerio = require('cheerio');
var request = require('request');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/scrape', function(req, res) {

});

module.exports = router;