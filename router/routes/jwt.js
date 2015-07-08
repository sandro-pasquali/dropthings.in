var path	= require('path');
var jwt 	= require('jsonwebtoken');
var config	= require('../../config');

module.exports = function(app, authenticate) {
	app.get('/jwt/retrieve', function(req, res) {
		res.render('login', {});
	});
};