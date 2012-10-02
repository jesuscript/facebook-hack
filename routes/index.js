var mongoose = require('mongoose/');
mongoose.connect('mongodb://:@localhost:27017/local');
Schema = mongoose.Schema;


UserSchema : new Schema({
  id: String,
  score: Number
});

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Photo mAsH' });
};
exports.mashed = function(req,res){
  var id = req.body.id;
};