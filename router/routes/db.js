var path	= require('path');
var config	= require('../../config');
var AWS 	= require('aws-sdk');

AWS.config.update(config.aws.config);

var S3 = new AWS.S3({
	params: {
		Bucket: config.aws.mappedFolders.default
	}
});

var publicDir = config.base.publicDir;

module.exports = function(app, authenticate) {
	app.post('/db/object/tag', function(req, res){
		res.send('tagging');
	});
	app.post('/db/object/search', function(req, res){
		res.send('searching');
	});
};