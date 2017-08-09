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
    var count = 0;

    $(".bam-article").each(function(i, element) {
      var heading = $(element).find("h1.headline").text();
      var url = $(element).find("a.more").attr("href");
      var summary = $(element).find(".blurb").find("p").text();

      var newArticle = new Article({
        heading: heading,
        url: url,
        summary: summary
      });

      var promise = Article.find({ heading: heading, url: url }).exec();
      promise.then(function(res) {
        if (res.length === 0) {
          newArticle.save(function(err, doc) {
            if (err) {}
            else {
              count++;
              console.log(count);
              console.log("Article stored");
            }
          });
        }
      });
    });
    console.log(count);
    res.json({ count: count });
  });
});

router.get("/articles", function(req, res) {
  Article.find({ saved: false }).sort({ createdAt: 1 }).exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.get("/articles/saved", function(req, res) {
  Article.find({ saved: true }).sort({ createdAt: 1 }).exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.post("/articles/saved/:id", function(req, res) {
  Article.findOneAndUpdate({ _id: req.params.id }, { saved: req.body.saved}).exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.get("/articles/:id", function(req, res) {
  Article.findOne({ _id: req.params.id }).populate("comments").exec(function(err, doc) {
    if (err) console.log(err);
    else res.json(doc);
  });
});

router.get("/saved", function(req, res) {
  res.render("saved");
});

module.exports = router;