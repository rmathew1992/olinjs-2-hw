var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'localhost');

var catSchema = mongoose.Schema({
  name: String,
  age: Number,
  color: String
});

var Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;
