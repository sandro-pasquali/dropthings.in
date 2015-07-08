var path	= require('path');
var config	= require('../../config');

module.exports = function(app, authenticate) {
	app.get('/', authenticate, function(req, res){
		res.render('index', {});
	});
	app.get('/about', authenticate, function(req, res){
		res.render('about', {});
	});
	app.get('/browse', authenticate, function(req, res){
		res.render('browse', {});
	});
	app.get('/contact', authenticate, function(req, res){
		res.render('contact', {});
	});
	app.get('/faq', authenticate, function(req, res){
		res.render('faq', {});
	});
	app.get('/make', authenticate, function(req, res){
		res.render('make', {});
	});
	app.get('/register', authenticate, function(req, res){
		res.render('register', {});
	});
	app.get('/deregister', authenticate, function(req, res){
		res.render('deregister', {});
	});
};