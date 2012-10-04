/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Photo mAsH' });
};
exports.mashed = function(req,res){
  var id = req.body.id;
};
