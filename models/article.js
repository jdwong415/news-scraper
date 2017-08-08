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
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;