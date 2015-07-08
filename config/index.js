"use strict";

var fs = require('fs');

try {
	var config = JSON.parse(fs.readFileSync('./config/.config.json', { 
		encoding: 'utf8'
	}));
} catch(e) {
	var config = require('./configBase.js');
}

module.exports = config;