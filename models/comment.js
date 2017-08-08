var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;