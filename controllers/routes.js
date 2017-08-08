const express = require('express');
const router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var Article = require('../models/article');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/scrape', function(req, res) {
  request("http://www.nytimes.com/section/technology", function(error, response, body) {
    var $ = cheerio.load(body);
    var arr = [];
    var articles = [];
    var count = 0;

    $(".story").each(function(i, element) {
      var heading = $(element).find("h2").text().trim();
      var url = $(element).find("a").attr("href");

      var newArticle = Article({
        heading: heading,
        url: url
      });

      articles.push(newArticle);

      var promise = Article.find({ heading: heading, url: url }).exec();
      promise.then(function(res) {
        if (res.length === 0) {
          newArticle.save(function(err) {
            count++;
            console.log("Article stored");
          });
        }
      });
    });
    arr.push({ articles: articles });
    arr.push({ count: count });
    res.json(arr);
  });
});

module.exports = router;