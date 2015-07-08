var path	= require('path');
var moment 	= require("moment");
var crypto	= require("crypto");
var uuid 	= require('node-uuid');
var config  = require('../../config');

var publicDir = path.resolve(config.base.publicDir);

function getBucketForType(fileData) {	

	var segs = fileData.type.toLowerCase().split("/");
	var mf = config.aws.mappedFolders;
	
	switch(segs[0]) {
		case 'image':
			return mf.image;
		break;
		
		case 'video':
			return mf.video;
		break;
		
		case 'text':
			return mf.text;
		break;
		
		default:
			return mf.default;
		break;
	}
}

module.exports = function(app, authenticate) {
	app.post("/amazon/s3/uploadpolicy", authenticate, function(request, response, next) {
		
		console.log(request.body);

		var maxUploadSize 	= config.aws.maxUploadSize;
		var bucketRoot 		= config.aws.bucketRoot;
		var toBucket		= getBucketForType(request.body);
		var acl				= config.aws.acl;
		var expiresMinutes	= config.aws.expiresMinutes;
		
		var fileKey		= request.body.name;
		var contentType	= request.body.type;
		var size		= request.body.size;
		var error;
		
		if(typeof fileKey !== "string" || fileKey.trim() === "" || !contentType || !size) {
			error = new Error('Bad arguments');
  			error.status = 404;
  			return next(error);
		}
		
		if(!~config.aws.acceptedMimeTypes.indexOf(contentType.toLowerCase())) {
			error = new Error('Invalid Mime Type');
  			error.status = 400;
  			return next(error);
		}
		
		if(size > maxUploadSize) {
			error = new Error('Exceeded maximum upload size of ' + maxUploadSize + ' bytes');
  			error.status = 400;
  			return next(error);
		}

		fileKey = uuid.v4() + '.' + (new Date().getTime()) + path.extname(fileKey);
		
		//	Lose any leading/trailing slashes
		//
		fileKey = fileKey.replace(/^\/+|\/+$/g,"");
	
		var policy = (function() {
			var s3Policy = {
				expiration: moment.utc().add(expiresMinutes, 'minutes').format('YYYY-MM-DDTHH:mm:ss\\Z'),
				conditions: [
					{ "bucket": toBucket }, 
					["starts-with", "$key", fileKey], 
					{ "acl": acl }, 
					["content-length-range", 0, maxUploadSize], 
					["eq", "$Content-Type", contentType]
				]
			};
			return new Buffer(JSON.stringify(s3Policy)).toString("base64");
		})();

		response.send({
			data : {
			  "fileKey"			: fileKey,
			  "AWSAccessKeyId"	: config.aws.config.accessKeyId,
			  "acl"				: acl,
			  "policy"			: policy,
			  "signature"		: crypto.createHmac("sha1", config.aws.config.secretAccessKey).update(policy).digest("base64"),
			  "Content-Type"	: contentType,
			  "bucket"			: toBucket,
			  "bucketPath"		: bucketRoot + toBucket + "/" 
			}
		});
	});
};

