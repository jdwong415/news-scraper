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
    var added = 0;
    var length = $(".bam-article").length;

    function scrape() {
      if (count < length) {
        var element = $(".bam-article")[count];
        var heading = $(element).find("h1.headline").text();
        var url = $(element).find("a.more").attr("href");
        var summary = $(element).find(".blurb").find("p").text();

        var newArticle = {
          heading: heading,
          url: url,
          summary: summary
        };

        var promise = Article.findOne({heading: heading}).exec();
        promise.then(function(res) {
          if (!res) {
            newArticle = Article(newArticle);
            newArticle.save(function(err) {
              if (err) {
                console.log(err);
              }
              else {
                added++;
                count++;
                console.log("Article stored");
                scrape();
              }
            });
          }
          else {
            count++;
            scrape();
          }
        });
      }
      else {
        console.log("Scrape completed");
        res.json({count: added});
      }
    }
    scrape();
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

router.post("/articles/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  newComment.save(function(err, doc) {
    if (err) console.log(err);
    else {
      Article.findOneAndUpdate({_id: req.params.id}, { $push: {comments: doc._id}}, {new: true}, function(error, newdoc) {
        if (error) console.log(error);
        else res.send(newdoc);
      });
    }
  });
});

router.delete("/articles/comment/:id", function(req, res) {
  Comment.findOne({ _id: req.params.id }).remove().exec(function(err, doc) {
    if (err) console.log(err);
    else {
      Article.findOneAndUpdate({ _id: req.body.id}, { $pull: {comments: req.params.id }}, function(error, newdoc) {
        if (error) console.log(error);
      });
    };
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