const express = require('express');
const router = express.Router();
var cheerio = require('cheerio');
var request = require('request');
var mongoose = require('mongoose');
var Article = require('../models/article');
var Comment = require('../models/comment');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/scrape', function(req, res) {
  request("http://m.mlb.com/sf/news", function(error, response, body) {

    var $ = cheerio.load(body);
    var arr = [];
    var articles = [];
    var count = 0;

    $(".bam-article").each(function(i, element) {
      var heading = $(element).find("h1.headline").text();
      var url = $(element).find("a.more").attr("href");

      var newArticle = Article({
        heading: heading,
        url: url
      });
      articles.push(newArticle);

      var promise = Article.find({ heading: heading, url: url }).exec();
      promise.then(function(res) {
        if (res.length === 0) {
          newArticle.save(function(err, doc) {
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