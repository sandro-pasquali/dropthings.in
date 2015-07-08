var path	= require('path');
var passport = require('passport');
var config	= require('../../config');

module.exports = function(app, authenticate) {
	app.get('/login', function(req, res) {
		res.render('login', {});
	});
	
	app.get('/auth/github', passport.authenticate('github'), function(req, res) {
	});
	
	app.get('/auth/github/callback', passport.authenticate('github', { 
		failureRedirect: '/login' 
	}), function(req, res) {
		res.redirect('/');
	});
	
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};