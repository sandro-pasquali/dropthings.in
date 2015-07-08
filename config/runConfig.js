"use strict";

var fs = require('fs');
var _ = require('lodash');

var config = require('./');

// Ask config questions
//
require('./questions/development.js')(config, function(answers) {
	
	config.github.clientId = answers.github_client_id;
	config.github.clientSecret = answers.github_client_secret;
	config.aws.config.accessKeyId = answers.aws_access_key_id;
	config.aws.config.secretAccessKey = answers.aws_secret_access_key;
	config.server.protocol = answers.protocol;
	config.server.uri = answers.uri;
	config.server.host = answers.host;
	config.server.port = answers.port;
	config.server.sessionSecret = answers.sessionSecret;
	
	fs.writeFileSync('./config/.config.json', JSON.stringify(config));
});