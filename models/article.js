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
    required: true,
    unique: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;