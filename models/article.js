var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  heading: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    default: "/"
  },
  summary: {
    type: String
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;