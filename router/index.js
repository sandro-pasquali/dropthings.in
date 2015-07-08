var path		= require('path');
var config		= require('../config');
var util		= require('util');
var glob		= require('glob');
var fs			= require('fs');
var crypto		= require('crypto');
var hbs			= require('hbs');
var _ 			= require('lodash');
var passport	= require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var session 	= require('express-session')
var express  	= require('express');
var multer		= require('multer');
var uuid		= require('node-uuid');
var AWS 		= require('aws-sdk');

AWS.config.update(config.aws.config);

var S3 = new AWS.S3({
	params: {
		Bucket: config.aws.mappedFolders.default
	}
});

var app = express();

app.use(multer());

app.use(express.static(config.base.publicDir));

app.set('view engine', 'html');
app.set('views', config.base.templatesDir);
app.engine('html', hbs.__express);
hbs.registerPartials(config.base.partialsDir);

// required for passport
app.use(session({ 
	secret: config.server.sessionSecret,
	saveUninitialized: false,
	resave: false
})); 
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GitHubStrategy({
	clientID: config.github.clientId,
	clientSecret: config.github.clientSecret,
	callbackURL: config.server.protocol + '://' + config.server.uri + '/auth/github/callback'
}, function(accessToken, refreshToken, profile, done) {

	var key = crypto.createHash('sha256').update(profile.id + profile.username).digest('hex');
	var userObj = {
		lastLogin 	: new Date().getTime(),
		key 		: key,
		id			: profile.id,
		username 	: profile.username,
		emails 		: profile.emails,
		avatar 		: profile._json.avatar_url,
		followers 	: profile._json.followers,
		repos 		: profile._json.public_repos,
		gists 		: profile._json.public_gists,
		created 	: profile._json.created_at,
		updated 	: profile._json.updated_at
	}
	var s3Obj = {
		Key						: key,
		Body					: JSON.stringify(userObj),
		ServerSideEncryption    : "AES256",
		ContentType				: "application/json",
		ACL						: "private"
	}
	S3.putObject(s3Obj, function(err, data) {
		if(err) { 
			return done(err);
		}
		done(null, profile);
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = function _Server_Factory() {

	//	All js files in /routes should be modules returning functions
	//	that we pass the #app and the authentication method to.
	//
	glob.sync('./router/routes/*.js').forEach(function(r) {
		require(path.resolve(r))(app, function isAuthenticated(req, res, next) {
			if(req.isAuthenticated()) {
				return next();
			}
			res.redirect('/login');
		});
	});
	
	app.listen(config.server.port);
	
	console.log('listening ' + config.server.host + ':' + config.server.port);
};
