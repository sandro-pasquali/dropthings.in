"use strict";

var ask = require('./ask.js');
var _ = require('lodash');

var group1 = function(config) {
	return [{
		type: "input",
		name: "github_client_id",
		default: config.github.clientId,
		message: "Github client id"
	}, {
		type: "input",
		name: "github_client_secret",
		default: config.github.clientSecret,
		message: "Github client secret"
	}, {
		type: "input",
		name: "aws_access_key_id",
		default: config.aws.config.accessKeyId,
		message: "AWS access key id"
	}, {
		type: "input",
		name: "aws_secret_access_key",
		default: config.aws.config.secretAccessKey,
		message: "AWS secret access key"
	}, {
		type: "list",
		name: "protocol",
		default: config.server.protocol.toString(),
		message: "Which protocol should this server run on?",
		choices: [
			'http',
			'https'
		]
	}, {
		type: "input",
		name: "uri",
		default: config.server.uri,
		message: "Server URI"
	}, {
		type: "input",
		name: "host",
		default: config.server.host,
		message: "Server host"
	}, {
		type: "input",
		name: "port",
		default: config.server.port,
		message: "Server port"
	}, {
		type: "input",
		name: "sessionSecret",
		default: config.server.sessionSecret,
		message: "Session secret"
	}];
};

module.exports = function(config, complete) { 
	ask({
		groups : group1(config),
		complete : complete
	});
};